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

    const [totalProducts, totalInquiries, pendingInquiries, totalCategories] = await Promise.all([
      prisma.product.count(),
      prisma.inquiry.count(),
      prisma.inquiry.count({
        where: {
          status: "PENDING"
        }
      }),
      prisma.category.count(),
    ]);

    return NextResponse.json({
      totalProducts,
      totalInquiries,
      pendingInquiries,
      totalCategories,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
