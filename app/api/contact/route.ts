import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ContactBody {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactBody = await request.json();
    const { name, email, phone, company, subject, message } = body;

    // Validate required fields
    if (!name || !subject || !message) {
      return NextResponse.json(
        { error: "Name, subject, and message are required" },
        { status: 400 }
      );
    }

    // Create contact submission
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        company,
        subject,
        message,
        status: 'NEW'
      },
    });

    return NextResponse.json({
      success: true,
      contact: {
        id: contact.id,
        name: contact.name,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
