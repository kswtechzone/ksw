'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API } from '@/constants/api';
import { ArrowLeft } from 'lucide-react';

export default function EditPricingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    serviceId: '',
    category: '',
    price: 0,
    originalPrice: 0,
    billingPeriod: 'monthly',
    currency: 'NPR',
    description: '',
    features: '',
    highlighted: false,
    popular: false,
    order: 0,
    published: true,
  });

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    setToken(t);
    if (t) {
      fetchPlan(t);
      fetch(`${API.SERVICES}`, { headers: { 'Authorization': `Bearer ${t}` } })
        .then(r => r.json())
        .then(data => setServices(Array.isArray(data) ? data : []))
        .catch(() => {});
    }
  }, [params.id]);

  const fetchPlan = async (t: string) => {
    try {
      const res = await fetch(`${API.PRICING}/${params.id}`, {
        headers: { 'Authorization': `Bearer ${t}` }
      });
      if (!res.ok) {
        alert('Plan not found');
        router.push('/admin/pricing');
        return;
      }
      const data = await res.json();
      setFormData({
        name: data.name || '',
        serviceId: data.serviceId || '',
        category: data.category || '',
        price: data.price ?? 0,
        originalPrice: data.originalPrice ?? 0,
        billingPeriod: data.billingPeriod || 'monthly',
        currency: data.currency || 'NPR',
        description: data.description || '',
        features: Array.isArray(data.features) ? data.features.join('\n') : (data.features || ''),
        highlighted: data.highlighted || false,
        popular: data.popular || false,
        order: data.order ?? 0,
        published: data.published ?? true,
      });
    } catch (err) {
      console.error('Fetch plan error:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body: Record<string, any> = { ...formData };
      if (body.features) body.features = body.features.split('\n').map((f: string) => f.trim()).filter(Boolean);
      const res = await fetch(`${API.PRICING}/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        router.push('/admin/pricing');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update plan');
      }
    } catch (err) {
      console.error('Update plan error:', err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-12 text-slate-400">Loading plan...</div>;

  return (
    <div>
      <Link href="/admin/pricing" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Pricing
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Edit Pricing Plan</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Plan Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <div className="flex gap-2">
                <select
                  value={services.some(s => s.title === formData.category) ? formData.category : 'custom'}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setFormData(prev => ({ ...prev, category: '' }));
                    } else {
                      setFormData(prev => ({ ...prev, category: e.target.value }));
                    }
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white"
                >
                  <option value="" disabled>Select a service category</option>
                  {services.map((s: any) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                  <option value="custom">+ Custom category</option>
                </select>
                {!services.some(s => s.title === formData.category) && (
                  <input type="text" name="category" required value={formData.category} onChange={handleChange}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="Type custom category" />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Service (optional)</label>
              <select name="serviceId" value={formData.serviceId} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white">
                <option value="">None</option>
                {services.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Billing Period</label>
              <select name="billingPeriod" value={formData.billingPeriod} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
              <select name="currency" value={formData.currency} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white">
                <option value="NPR">NPR (Rs.)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
              <input type="number" name="price" required min={0} step="0.01" value={formData.price} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Original Price</label>
              <input type="number" name="originalPrice" min={0} step="0.01" value={formData.originalPrice} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea name="description" rows={3} value={formData.description} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Features (one per line)</label>
            <textarea name="features" rows={8} value={formData.features} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none font-mono text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="published" checked={formData.published} onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-slate-700">Published</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="popular" checked={formData.popular} onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-slate-700">Popular</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="highlighted" checked={formData.highlighted} onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-slate-700">Highlighted</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading}
              className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
              {loading ? 'Updating...' : 'Update Plan'}
            </button>
            <Link href="/admin/pricing"
              className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
