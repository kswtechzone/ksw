'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, ChevronDown, X, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { API } from '@/constants/api';

interface Plan {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  billingPeriod: string;
  currency: string;
  description: string;
  features: string[];
  popular: boolean;
  highlighted: boolean;
}

interface SelectedPlan {
  category: string;
  plan: string;
  price: number;
  currency: string;
  billingPeriod: string;
}

interface PricingSectionProps {
  serviceSlug?: string;
  serviceTitle?: string;
}

export default function PricingSection({ serviceSlug, serviceTitle }: PricingSectionProps) {
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('');
  const [selectedPlans, setSelectedPlans] = React.useState<SelectedPlan[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  const STORAGE_KEY = 'ksw-selected-plans';

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedPlans(parsed);
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPlans));
    } catch {}
  }, [selectedPlans, hydrated]);

  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setSelectedPlans(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  React.useEffect(() => {
    const url = serviceSlug
      ? API.PRICING_BY_SERVICE(serviceSlug)
      : API.PRICING + '?published=true';
    fetch(url)
      .then(r => r.json())
      .then(data => { setPlans(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [serviceSlug]);

  const grouped = plans.reduce<Record<string, Plan[]>>((acc, plan) => {
    if (!acc[plan.category]) acc[plan.category] = [];
    acc[plan.category].push(plan);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  React.useEffect(() => {
    if (categories.length > 0 && !activeTab) setActiveTab(categories[0]);
  }, [categories, activeTab]);

  const activePlans = grouped[activeTab] || [];

  const isSelected = (category: string, planName: string) =>
    selectedPlans.some(p => p.category === category && p.plan === planName);

  const togglePlan = (plan: Plan) => {
    setSelectedPlans(prev => {
      const exists = prev.find(p => p.category === plan.category && p.plan === plan.name);
      if (exists) return prev.filter(p => p !== exists);
      return [...prev, {
        category: plan.category,
        plan: plan.name,
        price: plan.price,
        currency: plan.currency,
        billingPeriod: plan.billingPeriod,
      }];
    });
  };

  const selectedCount = selectedPlans.length;
  const totalEstimate = selectedPlans.reduce((sum, p) => sum + p.price, 0);
  const serviceCategories = Array.from(new Set(selectedPlans.map(p => p.category)));
  const planDetails = selectedPlans.map(p => `${p.plan} (${p.category})`);
  const contactHref = selectedPlans.length > 0
    ? `/contact?services=${encodeURIComponent(serviceCategories.join(','))}&plans=${encodeURIComponent(planDetails.join(','))}`
    : '/contact';

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Loading pricing plans...
      </div>
    );
  }

  if (plans.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-16 relative">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {serviceTitle ? `${serviceTitle} Plans` : 'Pricing Plans'}
            </h2>
            <p className="text-lg text-muted-foreground">
              Select the plans you need. We&apos;ll create a custom package for you.
            </p>
          </motion.div>

          {categories.length > 1 && (
            <>
              <div className="flex justify-center mb-12 md:hidden">
                <div className="relative w-full max-w-xs">
                  <select
                    value={activeTab}
                    onChange={e => setActiveTab(e.target.value)}
                    className="w-full appearance-none px-5 py-3 rounded-xl bg-muted border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="hidden md:flex justify-center mb-12">
                <div className="relative max-w-full">
                  <div className="overflow-x-auto scrollbar-thin pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
                    <div className="inline-flex gap-1 rounded-2xl bg-muted p-1.5 shadow-inner mx-auto">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setActiveTab(category)}
                          className={`relative px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                            activeTab === category
                              ? 'bg-primary text-white shadow-lg shadow-primary/25'
                              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                          }`}
                        >
                          {category}
                          {activeTab === category && (
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold">{activeTab}</h3>
                <p className="text-muted-foreground mt-1">
                  {activePlans.length} plan{activePlans.length !== 1 ? 's' : ''} available
                </p>
              </div>
              {activePlans.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p>No plans available for this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activePlans.map((plan, i) => {
                    const selected = isSelected(plan.category, plan.name);
                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`relative rounded-2xl border p-6 transition-all duration-300 ${
                          selected
                            ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10'
                            : 'hover:shadow-xl hover:-translate-y-1'
                        } ${
                          plan.popular
                            ? 'border-primary/30 bg-gradient-to-b from-primary/5 to-background'
                            : 'border-border bg-background'
                        }`}
                      >
                        {selected && (
                          <div className="absolute top-3 right-3">
                            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}

                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                              <Zap className="h-3 w-3" />
                              Most Popular
                            </span>
                          </div>
                        )}

                        {plan.highlighted && !plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                              Best Value
                            </span>
                          </div>
                        )}

                        <div className="mb-6">
                          <h4 className="text-xl font-bold mb-1">{plan.name}</h4>
                          {plan.description && (
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                          )}
                        </div>

                        <div className="mb-6">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm text-muted-foreground">{plan.currency}</span>
                            <span className="text-4xl font-bold">{plan.price.toLocaleString()}</span>
                            {plan.originalPrice && plan.originalPrice > plan.price && (
                              <span className="text-lg text-muted-foreground line-through ml-2">
                                {plan.currency} {plan.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground capitalize">
                            /{plan.billingPeriod}
                          </span>
                        </div>

                        <ul className="space-y-3 mb-8">
                          {(plan.features || []).map((feature: string) => (
                            <li key={feature} className="flex items-start gap-3 text-sm">
                              <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          type="button"
                          className="w-full"
                          variant={selected ? 'default' : plan.popular ? 'default' : 'outline'}
                          onClick={() => togglePlan(plan)}
                        >
                          {selected ? 'Selected' : 'Select Plan'}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t shadow-2xl"
          >
            <div className="container max-w-5xl mx-auto px-4 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {selectedCount} plan{selectedCount > 1 ? 's' : ''} selected
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedPlans.map(p => (
                        <span
                          key={`${p.category}-${p.plan}`}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                        >
                          {p.plan}
                          <button
                            type="button"
                            onClick={() => setSelectedPlans(prev => prev.filter(x => x !== p))}
                            className="hover:text-primary/60 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Estimated total</p>
                    <p className="text-lg font-bold">{selectedPlans[0]?.currency || 'NPR'} {totalEstimate.toLocaleString()}/<span className="text-sm font-normal text-muted-foreground capitalize">{selectedPlans[0]?.billingPeriod || 'mo'}</span></p>
                  </div>
                  <Button size="lg" asChild className="rounded-full px-8">
                    <Link href={contactHref}>
                      Continue to Contact
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={selectedCount > 0 ? 'pb-28' : ''} />
    </>
  );
}
