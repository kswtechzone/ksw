import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendContactNotification } from '@/lib/email';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const { name, email, phone, service, message } = body;

  if (!name || !email || !message) {
    throw createApiError('Missing required fields', 400);
  }

  const contact = await prisma.contact.create({
    data: {
      name,
      email,
      phone: phone || null,
      service,
      message,
      status: 'unread',
    },
  });

  sendContactNotification(contact).catch(() => {});

  return NextResponse.json(
    { message: 'Form submitted successfully', contact },
    { status: 201 }
  );
});

export const GET = apiHandler(async () => {
  const submissions = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(submissions);
});
