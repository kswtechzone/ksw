'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { TiltCard } from '@/components/ui/tilt-card';
import {
  Code2,
  Globe,
  Smartphone,
  Megaphone,
  Cloud,
  Brain,
  Palette,
  HeadphonesIcon,
  Shield,
  BarChart3,
  Search,
  Share2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API } from '@/constants/api';

const iconMap: Record<string, React.ElementType> = {
  Code2, Globe, Smartphone, Megaphone, Cloud, Brain, Palette, HeadphonesIcon, Shield, BarChart3, Search, Share2,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  icon?: string;
  description: string;
}

export function ServicesOverview() {
  const [services, setServices] = React.useState<ServiceItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  React.useEffect(() => {
    fetch(API.SERVICES)
      .then(r => r.json())
      .then(data => { setServices(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 gradient-grid opacity-20" />
      <div className="container relative z-10">
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            We offer a comprehensive range of technology services to help 
            businesses innovate, grow, and succeed in the digital landscape.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading services...</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {services.map(({ id, title, icon, slug, description }, idx) => {
              const Icon = iconMap[icon || ''] || Code2;
              return (
                <motion.div
                  key={id}
                  variants={cardVariants}
                  className={`${idx >= 3 ? 'hidden sm:block' : ''}`}
                >
                  <TiltCard className="group relative rounded-xl border bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg hover:shadow-ksw-500/5">
                  <div className="h-12 w-12 rounded-lg bg-ksw-500/10 flex items-center justify-center mb-4 group-hover:bg-ksw-500/20 transition-colors">
                    <Icon className="h-6 w-6 text-ksw-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {description}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-ksw-500" asChild>
                    <Link href={`/services/${slug}`}>
                      Learn More
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                  </TiltCard>
                </motion.div>
              );
            })}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center mt-4">
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/services">
                  All Services
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
