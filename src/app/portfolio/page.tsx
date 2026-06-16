'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from '@/components/ui/tilt-card';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { API } from '@/constants/api';

export default function PortfolioPage() {
  const [projects, setProjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState('All');

  React.useEffect(() => {
    fetch(API.PORTFOLIOS)
      .then(r => r.json())
      .then(data => { setProjects(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(projects.map(p => p.category)));
  const allCategories = ['All', ...categories];

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <div className="pt-24">
        <section className="py-24">
          <div className="container text-center text-muted-foreground">Loading portfolio...</div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <section className="py-24 relative">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Our <span className="text-primary">Portfolio</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Showcasing our best work across industries.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  activeCategory === cat
                    ? 'bg-ksw-500 text-white'
                    : 'bg-accent hover:bg-accent/80'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <TiltCard className="rounded-xl border bg-card overflow-hidden hover:shadow-lg">
                  <div className="aspect-video bg-gradient-to-br from-ksw-500/10 to-background flex items-center justify-center">
                    <span className="text-4xl font-bold text-ksw-500/20">
                      {project.title.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {project.category}
                    </Badge>
                    <h3 className="font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(project.tags || []).map((tag: string) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-md bg-accent">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {project.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" /> Live
                          </a>
                        </Button>
                      )}
                      {project.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-3 w-3 mr-1" /> Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
