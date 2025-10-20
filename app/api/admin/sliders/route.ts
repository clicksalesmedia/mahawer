import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

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
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, image, category, isActive, order, buttonText, buttonLink } = body;

    if (!title || !image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      );
    }

    const slider = await prisma.heroSlider.create({
      data: {
        title,
        description,
        image,
        category,
        isActive: isActive ?? true,
        order: order ?? 0,
        buttonText,
        buttonLink,
      },
    });

    return NextResponse.json(slider, { status: 201 });
  } catch (error) {
    console.error('Error creating slider:', error);
    
    // More detailed error logging
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
