'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Code2, Globe, Smartphone, Megaphone, Cloud,
  Briefcase, Brain, BarChart3, Building2, Database,
  ShoppingCart, Hotel, Palette, LayoutDashboard, Monitor,
} from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { API } from '@/constants/api';

const iconMap: Record<string, React.ElementType> = {
  Code2, Globe, Smartphone, Megaphone, Cloud,
  Briefcase, Brain, BarChart3, Building2, Database,
  ShoppingCart, Hotel, Palette, LayoutDashboard, Monitor,
};

export default function ServicesPage() {
  const [services, setServices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(API.SERVICES)
      .then(r => r.json())
      .then(data => { setServices(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-24">
        <section className="py-24">
          <div className="container text-center text-muted-foreground">Loading services...</div>
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
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              End-to-end technology services to bring your ideas to life.
            </p>
          </motion.div>
        </div>
      </section>

      {services.map((service, i) => {
        const Icon = iconMap[service.icon] || Code2;
        const features: string[] = service.features || [];
        return (
          <section
            key={service.id}
            id={service.slug}
            className={`py-24 ${i % 2 === 1 ? 'bg-muted/30' : ''}`}
          >
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                <div>
                  {service.image ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6">
                      <Image src={service.image} alt={service.title} width={64} height={64} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ksw-400 to-ksw-600 flex items-center justify-center mb-6">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <ul className="grid grid-cols-2 gap-3">
                    {features.map((feature: string) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-ksw-500" />
                        {feature}
                      </li>
                    ))}
                    </ul>
                    <Button variant="link" className="text-ksw-500 mt-4" asChild>
                      <Link href={`/services/${service.slug}`}>
                        Learn More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                <div className="relative">
                  {service.image ? (
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden border">
                      <Image src={service.image} alt={service.title} width={600} height={450} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] rounded-2xl border bg-gradient-to-br from-ksw-500/5 to-background flex items-center justify-center">
                      <Icon className="h-32 w-32 text-ksw-500/20" />
                    </div>
                  )}
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-ksw-500/10 rounded-full blur-3xl" />
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}

      <section className="py-24 bg-gradient-to-br from-ksw-500/10 via-ksw-500/5 to-background">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              We tailor every solution to your specific needs. Let&apos;s discuss your project.
            </p>
            <Button size="xl" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
