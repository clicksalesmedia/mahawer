import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const limitParam = searchParams.get('limit');
    const pageParam = searchParams.get('page');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    console.log('API Request params:', { categoryId, search, limit, page, url: request.url });

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

    // If pagination is requested, return paginated results with total count
    if (limit && page) {
      const skip = (page - 1) * limit;
      
      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where: whereCondition,
          include: {
            category: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: limit,
          skip: skip,
        }),
        prisma.product.count({
          where: whereCondition,
        }),
      ]);

      console.log('Paginated products found:', products.length, 'total:', totalCount);
      return NextResponse.json({
        products,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      });
    }

    // For non-paginated requests (like hero carousel), return simple array
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

    console.log('Non-paginated products found:', products.length);
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


