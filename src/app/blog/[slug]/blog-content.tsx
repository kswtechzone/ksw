'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { ShareButtons } from '@/components/share-buttons';

interface BlogContentProps {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  image: string | null;
  description?: string;
}

export function BlogContent({ slug, title, category, author, date, readTime, content, image, description }: BlogContentProps) {
  return (
    <div className="pt-24">
      <article className="py-24">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button variant="ghost" asChild className="mb-8">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            <Badge variant="secondary" className="mb-4">{category}</Badge>
            <h1 className="text-4xl font-bold mb-6">{title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readTime}
              </span>
            </div>

            <div className="flex items-center justify-between mb-8 pb-4 border-b">
              <ShareButtons
                url={`/blog/${slug}`}
                title={title}
                description={description}
                image={image || undefined}
              />
            </div>

            {image && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  width={1200}
                  height={675}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            <div
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </motion.div>
        </div>
      </article>
    </div>
  );
}
