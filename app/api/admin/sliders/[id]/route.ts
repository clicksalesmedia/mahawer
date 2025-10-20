import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

// GET - Fetch single slider
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slider = await prisma.heroSlider.findUnique({
      where: { id: params.id },
    });

    if (!slider) {
      return NextResponse.json(
        { error: 'Slider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(slider);
  } catch (error) {
    console.error('Error fetching slider:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slider' },
      { status: 500 }
    );
  }
}

// PUT - Update slider
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const slider = await prisma.heroSlider.update({
      where: { id: params.id },
      data: {
        title,
        description,
        image,
        category,
        isActive,
        order,
        buttonText,
        buttonLink,
      },
    });

    return NextResponse.json(slider);
  } catch (error) {
    console.error('Error updating slider:', error);
    return NextResponse.json(
      { error: 'Failed to update slider' },
      { status: 500 }
    );
  }
}

// DELETE - Delete slider
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.heroSlider.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Slider deleted successfully' });
  } catch (error) {
    console.error('Error deleting slider:', error);
    return NextResponse.json(
      { error: 'Failed to delete slider' },
      { status: 500 }
    );
  }
}
