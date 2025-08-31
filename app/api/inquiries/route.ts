import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface InquiryItem {
  productId: string;
  quantity: number;
  specifications?: string;
  brand?: string;
  notes?: string;
}

interface InquiryBody {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  companyName?: string;
  items: InquiryItem[];
}

export async function POST(request: Request) {
  try {
    const body: InquiryBody = await request.json();
    const { customerName, customerEmail, customerPhone, companyName, items } = body;

    // Create inquiry with items
    const inquiry = await prisma.inquiry.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        companyName,
        totalItems: items.length,
        items: {
          create: items.map((item: InquiryItem) => ({
            productId: item.productId,
            quantity: item.quantity,
            specifications: item.specifications,
            brand: item.brand,
            notes: item.notes,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


