import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { BlogContent } from './blog-content';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await prisma.blog.findUnique({
      where: { slug },
      select: {
        title: true,
        description: true,
        image: true,
        author: true,
        category: true,
        createdAt: true,
      },
    });

    if (!post) return { title: 'Post Not Found' };

    const title = `${post.title} | KSW TechZone`;
    const description = post.description
      ? `${post.description.substring(0, 160)}`
      : `Read ${post.title} by KSW TechZone. Insights on ${post.category}.`;
    const image = post.image || '/og-image.png';

    return {
      title: post.title,
      description,
      category: post.category,
      authors: [{ name: post.author, url: 'https://kswtechzone.com' }],
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: post.createdAt.toISOString(),
        authors: [post.author],
        images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: `https://kswtechzone.com/blog/${slug}`,
      },
    };
  } catch {
    return { title: 'Post Not Found' };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post: {
    id: string;
    title: string;
    slug: string;
    author: string;
    category: string;
    tags: string[];
    image: string | null;
    description: string;
    content: string;
    published: boolean;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
    authorId: string | null;
  } | null = null;

  try {
    post = await prisma.blog.findUnique({ where: { slug } });
  } catch {
    // fallback: try API route
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/blogs/by-slug/${slug}`, {
        cache: 'no-store',
      });
      if (res.ok) post = await res.json();
    } catch {
      // not found
    }
  }

  if (!post) notFound();

  const readTime = Math.max(1, Math.ceil((post.content?.length || 0) / 1500)) + ' min read';

  return (
    <BlogContent
      slug={slug}
      title={post.title}
      category={post.category}
      author={post.author}
      date={post.createdAt.toISOString()}
      readTime={readTime}
      content={post.content}
      image={post.image}
      description={post.description}
    />
  );
}
