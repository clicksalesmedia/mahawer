import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}${fileExtension}`;

    // Determine upload directory based on environment
    let uploadsDir: string;
    let fileUrl: string;
    
    // Check if we're in a serverless environment (like Vercel)
    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    if (isServerless) {
      // In serverless environments, use /tmp directory
      uploadsDir = path.join('/tmp', 'uploads');
      fileUrl = `/api/files/${fileName}`; // We'll need to create a file serving endpoint
      
      console.log('Serverless environment detected, using /tmp directory');
    } else {
      // In local/traditional hosting, use public/uploads
      uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      fileUrl = `/uploads/${fileName}`;
      
      console.log('Local environment detected, using public/uploads directory');
    }

    // Create uploads directory if it doesn't exist
    try {
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
        console.log('Created uploads directory:', uploadsDir);
      }
    } catch (mkdirError) {
      console.error('Error creating uploads directory:', mkdirError);
      
      // If we can't create the directory, return a helpful error
      return NextResponse.json(
        { 
          error: 'Cannot create upload directory',
          details: `Failed to create directory: ${uploadsDir}. Error: ${mkdirError instanceof Error ? mkdirError.message : 'Unknown error'}`,
          suggestion: 'Please ensure the application has write permissions or configure external storage (Cloudinary, AWS S3, etc.)'
        },
        { status: 500 }
      );
    }

    const filePath = path.join(uploadsDir, fileName);

    // Write file to disk
    try {
      await writeFile(filePath, buffer);
      console.log('File written successfully:', filePath);
    } catch (writeError) {
      console.error('Error writing file:', writeError);
      
      return NextResponse.json(
        { 
          error: 'Cannot write file',
          details: `Failed to write file: ${filePath}. Error: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`,
          suggestion: 'Please ensure the application has write permissions to the uploads directory'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: fileName,
      environment: isServerless ? 'serverless' : 'local'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Check server logs for more details'
      },
      { status: 500 }
    );
  }
}
