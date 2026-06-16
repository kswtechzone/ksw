import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const plan = await prisma.pricingPlan.findUnique({
    where: { id },
    include: { service: { select: { id: true, title: true, slug: true } } },
  });
  if (!plan) throw createApiError('Not found', 404);
  return NextResponse.json(plan);
});

export const PUT = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const body = await req.json();
  const plan = await prisma.pricingPlan.update({ where: { id }, data: body });
  return NextResponse.json(plan);
});

export const DELETE = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  await prisma.pricingPlan.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
