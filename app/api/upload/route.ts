import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary configuration missing');
      return NextResponse.json(
        { 
          error: 'Cloudinary not configured',
          details: 'Missing Cloudinary environment variables. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
          suggestion: 'Add Cloudinary credentials to your environment variables.'
        },
        { status: 500 }
      );
    }

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

    // Upload to Cloudinary
    console.log('Uploading to Cloudinary...');
    
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
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
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log('Cloudinary upload success:', result?.public_id);
              resolve(result);
            }
          }
        ).end(buffer);
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
      
      console.log('Upload successful:', response.public_id);
      return NextResponse.json(response);

    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError);
      return NextResponse.json(
        { 
          error: 'Failed to upload to Cloudinary',
          details: cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown Cloudinary error',
          suggestion: 'Please check your Cloudinary configuration and try again.'
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