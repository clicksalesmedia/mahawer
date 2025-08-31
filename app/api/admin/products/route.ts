import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../../../lib/authOptions";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      categoryId,
      images,
      isActive,
      isCashImport,
    } = body;

    // Validate required fields
    if (!nameAr || !nameEn || !categoryId) {
      return NextResponse.json(
        { error: "Name (Arabic), Name (English), and Category are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        nameAr,
        nameEn,
        descriptionAr,
        descriptionEn,
        categoryId,
        images: images || [],
        isActive: isActive !== undefined ? isActive : true,
        isCashImport: isCashImport !== undefined ? isCashImport : false,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
