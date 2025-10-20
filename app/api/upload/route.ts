import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: NextRequest) {
  console.log('=== Upload API called ===');
  
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

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    console.log('File size:', file.size, 'Max size:', maxSize);
    
    if (file.size > maxSize) {
      console.log('File too large');
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('Buffer created, size:', buffer.length);

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}${fileExtension}`;
    console.log('Generated filename:', fileName);

    // Always use local directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadsDir, fileName);
    const fileUrl = `/uploads/${fileName}`;
    
    console.log('Upload directory:', uploadsDir);
    console.log('File path:', filePath);

    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadsDir)) {
      console.log('Creating uploads directory...');
      await mkdir(uploadsDir, { recursive: true });
      console.log('Directory created');
    } else {
      console.log('Directory already exists');
    }

    // Write file to disk
    await writeFile(filePath, buffer);
    console.log('File written successfully');

    const response = {
      success: true,
      url: fileUrl,
      filename: fileName
    };
    
    console.log('Sending response:', response);
    return NextResponse.json(response);

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
