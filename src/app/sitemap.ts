import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kswtechzone.com';

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/ourteam`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/whychooseus`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
  ];

  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const [blogs, services] = await Promise.all([
      prisma.blog.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.service.findMany({ select: { slug: true, updatedAt: true } }),
    ]);
    dynamicEntries = [
      ...blogs.map((b) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
      ...services.map((s) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ];
    await prisma.$disconnect();
  } catch {
    // skip if no db connection
  }

  return [...staticPages, ...dynamicEntries];
}
