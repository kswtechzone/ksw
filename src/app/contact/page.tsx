'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Loader2, Check, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/layout/toaster';
import { API } from '@/constants/api';

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
}

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@kswtechzone.com';
const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+977-9863198323';

const contactInfo = [
  { icon: Mail, label: 'Email', value: contactEmail, href: `mailto:${contactEmail}` },
  { icon: Phone, label: 'Phone', value: contactPhone, href: `tel:${contactPhone.replace(/[^+\d]/g, '')}` },
  { icon: MapPin, label: 'Location', value: 'Kathmandu, Nepal', href: '#' },
  { icon: Clock, label: 'Hours', value: 'Sun-Fri: 9AM-6PM NPT' },
];

function parsePreselectedServices(): { preselected: string[]; custom: string[]; plans: string[] } {
  if (typeof window === 'undefined') return { preselected: [], custom: [], plans: [] };
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('services');
  const rawPlans = params.get('plans');
  const plan = params.get('plan');
  const all = raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];
  const plans = rawPlans ? rawPlans.split(',').map(s => s.trim()).filter(Boolean) : [];
  if (plan && !all.includes(plan)) all.push(plan);
  return { preselected: all, custom: [], plans };
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [services, setServices] = React.useState<ServiceItem[]>([]);
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);
  const [selectedPlans, setSelectedPlans] = React.useState<string[]>([]);
  const [sent, setSent] = React.useState(false);
  const customInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetch(API.SERVICES)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setServices(data); })
      .catch(() => {});

    const { preselected, plans } = parsePreselectedServices();
    if (preselected.length > 0) {
      setSelectedServices(preselected);
    }
    if (plans.length > 0) {
      setSelectedPlans(plans);
    }
  }, []);

  const toggleService = (title: string) => {
    setSelectedServices(prev =>
      prev.includes(title)
        ? prev.filter(s => s !== title)
        : [...prev, title]
    );
  };

  const addCustomService = (value: string) => {
    const val = value.trim();
    if (val && !selectedServices.includes(val)) {
      setSelectedServices(prev => [...prev, val]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    const serviceNames = services.map(s => s.title);
    const preselected = selectedServices.filter(s => serviceNames.includes(s));
    const custom = selectedServices.filter(s => !serviceNames.includes(s));
    const serviceJson = JSON.stringify({ preselected, custom });

    const data = {
      name,
      email,
      phone: phone || undefined,
      service: serviceJson,
      message,
    };

    try {
      const res = await fetch(API.CONTACTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to send message');

      form.reset();
      setSelectedServices([]);
      setSent(true);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24">
      <Toaster />
      <section className="py-24 relative">
        <div className="hero-gradient absolute inset-0" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Get In <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a project in mind? We&apos;d love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-ksw-500/10 flex items-center justify-center shrink-0">
                    <info.icon className="h-5 w-5 text-ksw-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{info.label}</div>
                    {info.href ? (
                      <a href={info.href} className="font-medium hover:text-ksw-500 transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <div className="font-medium">{info.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 px-6 rounded-2xl border bg-card"
                >
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Quote Request Sent!</h3>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                    Thank you for reaching out. We&apos;ll review your requirements and get back to you within 24 hours.
                  </p>
                  <Button variant="outline" size="lg" onClick={() => setSent(false)}>
                    Send Another Request
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+977-98XXXXXXXX" />
                  </div>

                  <div className="space-y-3">
                    {selectedPlans.length > 0 && (
                      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                        <p className="text-sm font-semibold mb-2">Selected Plans</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPlans.map(p => (
                            <span key={p} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Label>Services Interested In</Label>
                    {services.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {services.map((s) => {
                          const selected = selectedServices.includes(s.title);
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => toggleService(s.title)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm text-left transition-all ${
                                selected
                                  ? 'border-ksw-500 bg-ksw-500/10 text-ksw-700 dark:text-ksw-300'
                                  : 'border-border bg-background hover:border-ksw-300'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                                selected
                                  ? 'border-ksw-500 bg-ksw-500'
                                  : 'border-muted-foreground/30'
                              }`}>
                                {selected && <Check className="h-3 w-3 text-white" />}
                              </div>
                              {s.title}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        ref={customInputRef}
                        type="text"
                        placeholder="Add custom service (e.g. Logo Design, API Integration)"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-background"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomService(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (customInputRef.current) {
                            addCustomService(customInputRef.current.value);
                            customInputRef.current.value = '';
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>

                    {selectedServices.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedServices.map(s => (
                          <span
                            key={s}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                              services.some(svc => svc.title === s)
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground border border-dashed border-muted-foreground/30'
                            }`}
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() => setSelectedServices(prev => prev.filter(x => x !== s))}
                              className="hover:opacity-60 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your project, budget, timeline..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {selectedServices.length > 0 ? 'Send Quote Request' : 'Send Message'}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
