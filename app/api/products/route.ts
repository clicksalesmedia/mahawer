import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const whereCondition: {
      isActive: boolean;
      categoryId?: string;
      OR?: Array<{
        nameAr?: { contains: string; mode: 'insensitive' };
        nameEn?: { contains: string; mode: 'insensitive' };
        descriptionAr?: { contains: string; mode: 'insensitive' };
        descriptionEn?: { contains: string; mode: 'insensitive' };
      }>;
    } = {
      isActive: true,
    };

    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    if (search) {
      whereCondition.OR = [
        { nameAr: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
        { descriptionEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    const queryOptions: {
      where: typeof whereCondition;
      include: { category: true };
      orderBy: { createdAt: 'desc' };
      take?: number;
    } = {
      where: whereCondition,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    if (limit) {
      queryOptions.take = limit;
    }

    const products = await prisma.product.findMany(queryOptions);

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
    const body = await request.json();
    const { nameAr, nameEn, descriptionAr, descriptionEn, categoryId, hasCustomSpecs, isCashImport, specifications } = body;

    const product = await prisma.product.create({
      data: {
        nameAr,
        nameEn,
        descriptionAr,
        descriptionEn,
        categoryId,
        hasCustomSpecs: hasCustomSpecs || false,
        isCashImport: isCashImport || false,
        specifications: specifications || [],
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


