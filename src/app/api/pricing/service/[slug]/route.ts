import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) throw createApiError('Service not found', 404);

  const plans = await prisma.pricingPlan.findMany({
    where: {
      OR: [
        { serviceId: service.id },
        { category: { equals: service.title, mode: 'insensitive' } },
      ],
      published: true,
    },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(plans);
});
