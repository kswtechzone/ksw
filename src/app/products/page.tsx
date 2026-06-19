'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe, Clock, Megaphone, Cpu, Package as PackageIcon, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { API } from '@/constants/api';

const iconMap: Record<string, React.ElementType> = {
  Building2, Globe, Clock, Megaphone, Cpu, Package: PackageIcon,
};

const gradients = [
  'from-blue-500 to-indigo-500',
  'from-purple-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-green-500 to-emerald-500',
  'from-cyan-500 to-teal-500',
  'from-rose-500 to-red-500',
  'from-violet-500 to-purple-500',
  'from-sky-500 to-cyan-500',
];

interface Product {
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  icon?: string;
  features: string[];
  image?: string;
  status: string;
  url?: string;
  order: number;
}

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(API.PRODUCTS)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24">
      <section className="py-24 relative">
        <div className="hero-gradient absolute inset-0" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Our <span className="gradient-text">Products</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Innovative platforms and solutions built by KSW TechZone.
            </p>
          </motion.div>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading products...</div>
      ) : (
        products.map((product, i) => {
          const Icon = iconMap[product.icon || ''] || PackageIcon;
          const color = gradients[i % gradients.length];
          const statusLabel =
            product.status === 'active' ? 'Live'
            : product.status === 'development' ? 'Coming Soon'
            : product.status;

          return (
            <section key={product.id} id={product.slug} className={`py-24 ${i % 2 === 1 ? 'bg-muted/30' : ''}`}>
              <div className="container">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        {product.image ? (
                          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                            <Image src={product.image} alt={product.title} width={64} height={64} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                        )}
                        <div>
                          <h2 className="text-3xl font-bold">{product.title}</h2>
                          {product.tagline && (
                            <p className="text-ksw-500">{product.tagline}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-6">{product.description}</p>
                      {product.features && product.features.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                          {product.features.map((feature: string) => (
                            <div key={feature} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-ksw-500 mt-0.5 shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-3">
                        <Badge variant={product.status === 'active' ? 'success' : 'secondary'} className="text-sm px-4 py-1">
                          {statusLabel}
                        </Badge>
                        {product.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={product.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Visit Site
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      {product.image ? (
                        <div className="aspect-[16/10] rounded-2xl overflow-hidden border">
                          <Image src={product.image} alt={product.title} width={800} height={500} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] rounded-2xl border bg-gradient-to-br from-ksw-500/5 to-background flex items-center justify-center">
                          <Icon className="h-40 w-40 text-ksw-500/20" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
