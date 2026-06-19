'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Code2, Globe, Smartphone, Megaphone, Cloud,
  Briefcase, Brain, BarChart3, Building2, Database,
  ShoppingCart, Hotel, Palette, LayoutDashboard, Monitor,
  HeadphonesIcon, Shield, Search, Share2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PricingSection from '@/components/services/pricing-section';

const iconMap: Record<string, React.ElementType> = {
  Code2, Globe, Smartphone, Megaphone, Cloud,
  Briefcase, Brain, BarChart3, Building2, Database,
  ShoppingCart, Hotel, Palette, LayoutDashboard, Monitor,
  HeadphonesIcon, Shield, Search, Share2,
};

interface Service {
  id: string;
  title: string;
  slug: string;
  icon?: string;
  description: string;
  content?: string;
  features: string[];
  image?: string;
}

const relatedServices: Record<string, { name: string; slug: string; icon: string }[]> = {
  software: [
    { name: 'Web Development', slug: 'web', icon: 'Globe' },
    { name: 'Mobile App Development', slug: 'mobile', icon: 'Smartphone' },
    { name: 'Cloud Solutions', slug: 'cloud', icon: 'Cloud' },
  ],
  web: [
    { name: 'Software Development', slug: 'software', icon: 'Code2' },
    { name: 'E-commerce Solutions', slug: 'ecommerce', icon: 'ShoppingCart' },
    { name: 'UI UX Design', slug: 'ui-ux', icon: 'Palette' },
  ],
  mobile: [
    { name: 'Software Development', slug: 'software', icon: 'Code2' },
    { name: 'Web Development', slug: 'web', icon: 'Globe' },
    { name: 'AI Solutions', slug: 'ai', icon: 'Brain' },
  ],
  marketing: [
    { name: 'Web Development', slug: 'web', icon: 'Globe' },
    { name: 'Software Development', slug: 'software', icon: 'Code2' },
    { name: 'AI Solutions', slug: 'ai', icon: 'Brain' },
  ],
  cloud: [
    { name: 'Software Development', slug: 'software', icon: 'Code2' },
    { name: 'SaaS Development', slug: 'saas', icon: 'LayoutDashboard' },
    { name: 'AI Solutions', slug: 'ai', icon: 'Brain' },
  ],
  ai: [
    { name: 'Software Development', slug: 'software', icon: 'Code2' },
    { name: 'Cloud Solutions', slug: 'cloud', icon: 'Cloud' },
    { name: 'Digital Marketing', slug: 'marketing', icon: 'Megaphone' },
  ],
};

export function ServiceContent({ service }: { service: Service }) {
  const Icon = iconMap[service.icon || ''] || Code2;
  const features: string[] = service.features || [];
  const slug = service.slug;
  const related = relatedServices[slug] || [];

  return (
    <div className="pt-24">
      <section className="py-24">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button variant="ghost" asChild className="mb-8">
              <Link href="/services">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Link>
            </Button>

            <div className="flex items-center gap-4 mb-6">
              {service.image ? (
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                  <Image src={service.image} alt={service.title} width={64} height={64} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ksw-400 to-ksw-600 flex items-center justify-center shrink-0">
                  <Icon className="h-8 w-8 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold">{service.title}</h1>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-10">
              {service.description}
            </p>

            {features.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature: string) => (
                    <div key={feature} className="flex items-start gap-3 p-4 rounded-xl border bg-card/50">
                      <Check className="h-5 w-5 text-ksw-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.content && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6">Details</h2>
                <div
                  className="prose prose-neutral dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: service.content }}
                />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <PricingSection serviceSlug={slug} serviceTitle={service.title} />

      {related.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center">
                Explore More <span className="text-primary">Services</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map(r => {
                  const RelIcon = iconMap[r.icon] || Code2;
                  return (
                    <Link
                      key={r.slug}
                      href={`/services/${r.slug}`}
                      className="group flex flex-col items-center gap-3 p-6 rounded-2xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ksw-400 to-ksw-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <RelIcon className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-semibold text-center">{r.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <div className="h-4" />
    </div>
  );
}
