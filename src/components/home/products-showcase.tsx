'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { TiltCard } from '@/components/ui/tilt-card';
import {
  Building2,
  Clock,
  MapPin,
  BarChart3,
  Bot,
  CheckCircle2,
  ExternalLink,
  Package,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { API } from '@/constants/api';

const iconMap: Record<string, React.ElementType> = {
  Building2, Clock, MapPin, BarChart3, Bot, Package,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function ProductsShowcase() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  React.useEffect(() => {
    fetch(API.PRODUCTS)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="relative py-24 bg-muted/30">
      <div className="container">
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Products</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Innovative digital products built to solve real-world problems 
            and drive business growth.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading products...</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {products.map((product, idx) => {
              const Icon = iconMap[product.icon] || Package;
              const features: string[] = product.features || [];
              return (
                <motion.div
                  key={product.id}
                  variants={cardVariants}
                  className={`${idx >= 3 ? 'hidden sm:block' : ''}`}
                >
                  <TiltCard className="group relative rounded-xl border bg-card/50 backdrop-blur-lg p-6 hover:shadow-xl hover:shadow-ksw-500/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-ksw-500/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-ksw-500" />
                    </div>
                    <Badge
                      variant={product.status === 'active' ? 'success' : product.status === 'development' ? 'warning' : 'secondary'}
                    >
                      {product.status === 'active' ? 'Live' : product.status === 'development' ? 'Coming Soon' : product.status}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                  {product.tagline && (
                    <p className="text-xs text-muted-foreground mb-2">{product.tagline}</p>
                  )}
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>

                  {features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {features.map((feature: string) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-ksw-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button variant="ghost" className="group/btn p-0 h-auto text-ksw-500" asChild>
                    <Link href={`/products#${product.slug}`}>
                      Learn More
                      <ExternalLink className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
                    </Link>
                  </Button>
                  </TiltCard>
                </motion.div>
              );
            })}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center mt-4">
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/products">
                  All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
