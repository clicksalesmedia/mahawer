import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: NextRequest) {
  console.log('=== Cloudinary Upload API called ===');
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    console.log('Session:', session ? 'exists' : 'null');
    
    if (!session) {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check Cloudinary configuration with detailed logging
    console.log('Checking Cloudinary configuration...');
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'exists' : 'missing');
    console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'exists' : 'missing');
    console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'exists' : 'missing');
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary configuration missing');
      return NextResponse.json(
        { 
          error: 'Cloudinary not configured',
          details: 'Missing Cloudinary environment variables. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
          suggestion: 'Add Cloudinary credentials to your environment variables.',
          debug: {
            cloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: !!process.env.CLOUDINARY_API_KEY,
            apiSecret: !!process.env.CLOUDINARY_API_SECRET
          }
        },
        { status: 500 }
      );
    }

    // Configure Cloudinary with environment variables
    console.log('Configuring Cloudinary...');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Test Cloudinary configuration
    console.log('Testing Cloudinary config object...');
    const config = cloudinary.config();
    console.log('Cloudinary config:', {
      cloud_name: config.cloud_name,
      api_key: config.api_key ? 'exists' : 'missing',
      api_secret: config.api_secret ? 'exists' : 'missing'
    });

    // Get file from form data
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    console.log('File received:', file ? file.name : 'null');

    if (!file) {
      console.log('No file in request');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    console.log('File type:', file.type);
    
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for Cloudinary)
    const maxSize = 10 * 1024 * 1024; // 10MB
    console.log('File size:', file.size, 'Max size:', maxSize);
    
    if (file.size > maxSize) {
      console.log('File too large');
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('Buffer created, size:', buffer.length);

    // Test Cloudinary connection before upload
    console.log('Testing Cloudinary connection...');
    try {
      const pingResult = await cloudinary.api.ping();
      console.log('Cloudinary ping successful:', pingResult);
    } catch (pingError: any) {
      console.error('Cloudinary ping failed:', pingError);
      return NextResponse.json(
        { 
          error: 'Cloudinary connection failed',
          details: pingError?.message || 'Unable to connect to Cloudinary',
          suggestion: 'Please verify your Cloudinary credentials are correct.',
          debug: {
            pingError: pingError?.message,
            httpCode: pingError?.http_code
          }
        },
        { status: 500 }
      );
    }

    // Upload to Cloudinary
    console.log('Uploading to Cloudinary...');
    console.log('File buffer size:', buffer.length);
    
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        console.log('Starting Cloudinary upload stream...');
        
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'mahawer-sliders', // Organize uploads in a folder
            resource_type: 'image',
            transformation: [
              { width: 1920, height: 1080, crop: 'limit' }, // Limit max size
              { quality: 'auto' }, // Auto optimize quality
              { format: 'auto' } // Auto choose best format
            ]
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error details:', {
                message: error.message,
                http_code: error.http_code,
                error: error.error,
                name: error.name
              });
              reject(error);
            } else {
              console.log('Cloudinary upload success:', {
                public_id: result?.public_id,
                secure_url: result?.secure_url,
                width: result?.width,
                height: result?.height,
                format: result?.format,
                bytes: result?.bytes
              });
              resolve(result);
            }
          }
        );

        console.log('Ending upload stream with buffer...');
        uploadStream.end(buffer);
      });

      const result = uploadResult as any;
      
      const response = {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        filename: result.original_filename || file.name,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      };
      
      console.log('Upload successful, returning response:', response);
      return NextResponse.json(response);

    } catch (cloudinaryError: any) {
      console.error('=== Cloudinary Upload Error Details ===');
      console.error('Error type:', typeof cloudinaryError);
      console.error('Error name:', cloudinaryError?.name);
      console.error('Error message:', cloudinaryError?.message);
      console.error('HTTP code:', cloudinaryError?.http_code);
      console.error('Error object:', cloudinaryError?.error);
      console.error('Full error:', cloudinaryError);
      
      let errorMessage = 'Unknown Cloudinary error';
      let errorDetails = 'No additional details available';
      
      if (cloudinaryError?.message) {
        errorMessage = cloudinaryError.message;
      }
      
      if (cloudinaryError?.error?.message) {
        errorDetails = cloudinaryError.error.message;
      } else if (cloudinaryError?.http_code) {
        errorDetails = `HTTP ${cloudinaryError.http_code}: ${cloudinaryError?.error || 'Unknown HTTP error'}`;
      }
      
      // Fallback: Try to use a default image or return helpful error
      console.log('Cloudinary failed, providing fallback options...');
      
      return NextResponse.json(
        { 
          error: 'Failed to upload to Cloudinary',
          details: errorDetails,
          message: errorMessage,
          suggestion: 'You can use existing images from the catalogue or try again later.',
          fallbackImages: [
            '/catalogue/Sikaflex Construction.webp',
            '/catalogue/steel_mesh.png', 
            '/catalogue/Rock wool.jpg',
            '/catalogue/Aluminum flashing.jpg',
            '/catalogue/Ceramic fiber.jpg'
          ],
          debug: {
            httpCode: cloudinaryError?.http_code,
            errorType: typeof cloudinaryError,
            hasMessage: !!cloudinaryError?.message,
            hasError: !!cloudinaryError?.error
          }
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('=== Upload Error ===');
    console.error('Error:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}