'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Shield, Lightbulb, Handshake, Building2, Globe, Smartphone, Brain, Code2, Users, Megaphone, Cloud, BarChart3, HeadphonesIcon, Palette, Search, Share2 } from 'lucide-react';
import { API } from '@/constants/api';

const timelineIconMap: Record<string, React.ElementType> = {
  Building2, Globe, Smartphone, Brain, Code2, Users, Megaphone, Cloud, BarChart3, HeadphonesIcon, Palette, Search, Share2,
};

const DEFAULT_TIMELINE = [
  { year: '2019', title: 'Company Founded', icon: 'Building2', description: 'KSW TechZone was established in Kathmandu, Nepal with a vision to deliver world-class software solutions.' },
  { year: '2020', title: 'First Major Client', icon: 'Users', description: 'Secured our first enterprise client and grew the team to 10 members.' },
  { year: '2021', title: 'KSW Hospitality Launch', icon: 'Globe', description: 'Released our first SaaS product — a complete hotel and restaurant management system.' },
  { year: '2022', title: 'Mobile & Cloud Expansion', icon: 'Smartphone', description: 'Expanded into mobile app development and cloud solutions.' },
  { year: '2023', title: 'AI & Digital Marketing', icon: 'Brain', description: 'Launched our AI Solutions division and KIRA chatbot platform.' },
  { year: '2024', title: 'Team of 50+', icon: 'Code2', description: 'Scaled to over 50 professionals across engineering, design, and marketing.' },
  { year: '2025', title: 'Global Reach', icon: 'Globe', description: 'Started serving international clients from US, Europe, and Australia.' },
];

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We push boundaries and embrace emerging technologies.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Transparent, ethical, and honest in every engagement.',
  },
  {
    icon: Heart,
    title: 'Excellence',
    description: 'Relentless pursuit of quality in everything we build.',
  },
  {
    icon: Handshake,
    title: 'Partnership',
    description: 'We succeed when our clients succeed.',
  },
];

export default function AboutPage() {
  const [timeline, setTimeline] = React.useState(DEFAULT_TIMELINE);

  React.useEffect(() => {
      fetch(API.TIMELINE)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setTimeline(data); })
      .catch(() => {});
  }, []);

  return (
    <div className="pt-24">
      <section className="py-24 relative">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              About <span className="text-primary">KSW TechZone</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Founded in Nepal, KSW TechZone has grown from a small team of passionate
              developers into a comprehensive technology company serving clients worldwide.
              We combine deep technical expertise with business acumen to deliver solutions
              that drive real results.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-ksw-500" />
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground">
                To be the most trusted technology partner in Nepal and beyond, 
                driving digital transformation through innovative solutions that 
                empower businesses and communities.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-ksw-500" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground">
                To deliver exceptional digital solutions that solve real problems, 
                create value for our clients, and contribute to the growth of 
                the technology ecosystem in Nepal.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our <span className="text-primary">Values</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-3d-static text-center p-6 rounded-xl border bg-card"
              >
                <div className="w-14 h-14 rounded-xl bg-ksw-500/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-ksw-500" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-ksw-400 to-ksw-600 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                <span className="text-5xl font-bold text-white">SK</span>
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                  Message from Our <span className="text-primary">CEO</span>
                </h2>
                <p className="text-sm text-muted-foreground mb-6">Sanjay Kumar Sah — Founder & CEO</p>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    At KSW TechZone, we believe technology has the power to transform 
                    businesses and improve lives. Since our founding, we&apos;ve been 
                    committed to delivering innovative, high-quality solutions that 
                    make a real difference for our clients.
                  </p>
                  <p>
                    Our team of passionate developers, designers, and strategists 
                    works tirelessly to stay at the forefront of technology, ensuring 
                    that every project we deliver is built with the latest tools and 
                    best practices. We don&apos;t just build software — we build 
                    lasting partnerships.
                  </p>
                  <p>
                    Whether you&apos;re a startup looking to launch your first product 
                    or an enterprise seeking digital transformation, we&apos;re here 
                    to help you succeed. Let&apos;s create something exceptional together.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our <span className="text-primary">Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From a small startup to a comprehensive technology company — milestones that shaped who we are.
            </p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-ksw-500/50 via-ksw-500/20 to-transparent hidden md:block" />

            {timeline.map((event, i) => {
              const Icon = timelineIconMap[event.icon || ''] || Building2;
              const side = i % 2 === 0 ? 'left' : 'right';
              return (
                <motion.div
                  key={event.title + event.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 mb-12 md:mb-16 ${side === 'right' ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`hidden md:flex w-1/2 ${side === 'right' ? 'justify-start pl-8' : 'justify-end pr-8'}`}>
                    <div className={`${side === 'right' ? 'md:ml-8' : 'md:mr-8'} max-w-md`}>
                      <span className="text-sm font-bold text-ksw-500">{event.year}</span>
                      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                    <div className="w-10 h-10 rounded-full bg-background border-2 border-ksw-500 flex items-center justify-center z-10">
                      <Icon className="h-4 w-4 text-ksw-500" />
                    </div>
                  </div>

                  <div className="md:hidden flex items-start gap-4 pl-4 border-l-2 border-ksw-500/30 pb-2">
                    <div className="w-8 h-8 rounded-full bg-background border-2 border-ksw-500 flex items-center justify-center shrink-0 -ml-[21px] z-10">
                      <Icon className="h-3.5 w-3.5 text-ksw-500" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-ksw-500">{event.year}</span>
                      <h3 className="text-base font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
