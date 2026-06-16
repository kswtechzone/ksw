'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TiltCard } from '@/components/ui/tilt-card';
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { API } from '@/constants/api';

const categories = ['All', 'Technology', 'Business', 'Development', 'AI', 'Product'];

export default function BlogPage() {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('All');

  React.useEffect(() => {
    fetch(API.BLOGS)
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = posts.filter(post => {
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="pt-24">
      <section className="py-24 relative">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Our <span className="text-primary">Blog</span>
            </h1>
            <p className="text-muted-foreground">
              Insights, tutorials, and updates from the KSW TechZone team.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading posts...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No posts found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group"
                >
                  <TiltCard className="rounded-xl border bg-card hover:shadow-lg overflow-hidden">
                  {post.image && (
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {post.description}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Read More <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  </TiltCard>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
