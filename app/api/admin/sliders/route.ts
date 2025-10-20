import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

// GET - Fetch all sliders
export async function GET() {
  try {
    const sliders = await prisma.heroSlider.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(sliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sliders' },
      { status: 500 }
    );
  }
}

// POST - Create new slider
export async function POST(request: NextRequest) {
  console.log('=== Create Slider API called ===');
  
  try {
    // Test database connection first
    console.log('Testing database connection...');
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);
    console.log('Session:', session ? 'exists' : 'null');
    
    if (!session) {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Parsing request body...');
    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body, null, 2));
    
    const { title, description, image, category, isActive, order, buttonText, buttonLink } = body;

    if (!title || !image) {
      console.log('Missing required fields - title:', !!title, 'image:', !!image);
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      );
    }

    console.log('Creating slider with data:', { title, image, category, isActive, order });
    
    // Prepare data for database insertion
    const sliderData = {
      title: String(title),
      description: description ? String(description) : null,
      image: String(image),
      category: category ? String(category) : null,
      isActive: Boolean(isActive ?? true),
      order: Number(order ?? 0),
      buttonText: buttonText ? String(buttonText) : null,
      buttonLink: buttonLink ? String(buttonLink) : null,
    };
    
    console.log('Prepared slider data for DB:', JSON.stringify(sliderData, null, 2));
    
    try {
      const slider = await prisma.heroSlider.create({
        data: sliderData,
      });

      console.log('Slider created successfully:', slider.id);
      return NextResponse.json(slider, { status: 201 });
      
    } catch (dbCreateError) {
      console.error('Database create error:', dbCreateError);
      
      let errorMessage = 'Database insertion failed';
      let suggestion = 'Please check your database connection and try again.';
      
      // Check if it's a Prisma error
      if (dbCreateError && typeof dbCreateError === 'object' && 'code' in dbCreateError) {
        const prismaError = dbCreateError as any;
        console.error('Prisma error code:', prismaError.code);
        console.error('Prisma error message:', prismaError.message);
        
        // Handle specific Prisma errors
        if (prismaError.code === 'P2002') {
          errorMessage = 'A slider with this data already exists';
          suggestion = 'Please modify the slider data and try again.';
        } else if (prismaError.code === 'P2025') {
          errorMessage = 'The hero_sliders table does not exist in the database';
          suggestion = 'Please run database migration: npx prisma db push';
        } else if (prismaError.message?.includes('relation "hero_sliders" does not exist')) {
          errorMessage = 'The hero_sliders table is missing from the database';
          suggestion = 'Please run: npx prisma db push or create the table manually in Neon console';
        } else if (prismaError.message?.includes('column "category" does not exist')) {
          errorMessage = 'The category column is missing from hero_sliders table';
          suggestion = 'Please update your database schema by running: npx prisma db push';
        }
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to create slider in database',
          details: errorMessage,
          suggestion: suggestion,
          prismaCode: (dbCreateError as any)?.code,
          needsMigration: true
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('=== Create Slider Error ===');
    console.error('Error:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create slider',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
