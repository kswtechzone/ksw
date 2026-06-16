import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const published = searchParams.get('published');

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (published !== null) where.published = published === 'true';

  const plans = await prisma.pricingPlan.findMany({
    where,
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
    include: { service: { select: { id: true, title: true, slug: true } } },
  });
  return NextResponse.json(plans);
});

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const { name, serviceId, category, price, originalPrice, billingPeriod, currency, description, features, highlighted, popular, order, published } = body;

  if (!name || price === undefined) {
    throw createApiError('Missing required fields: name, price', 400);
  }

  const plan = await prisma.pricingPlan.create({
    data: {
      name,
      serviceId: serviceId || null,
      category: category || 'Digital Marketing',
      price,
      originalPrice: originalPrice || null,
      billingPeriod: billingPeriod || 'monthly',
      currency: currency || 'NPR',
      description: description || '',
      features: features || [],
      highlighted: highlighted ?? false,
      popular: popular ?? false,
      order: order ?? 0,
      published: published ?? true,
    },
  });
  return NextResponse.json(plan, { status: 201 });
});
