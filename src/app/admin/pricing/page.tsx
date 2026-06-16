'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API } from '@/constants/api';
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react';

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    setToken(t);
  }, []);

  useEffect(() => {
    if (token) fetchPlans();
    else setLoading(false);
  }, [token]);

  const fetchPlans = async () => {
    try {
      const res = await fetch(API.PRICING, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : data.plans || []);
    } catch (err) {
      console.error('Fetch pricing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) return;
    try {
      const res = await fetch(`${API.PRICING}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPlans(plans.filter(p => p.id !== id));
      } else {
        alert('Failed to delete plan');
      }
    } catch (err) {
      console.error('Delete pricing error:', err);
    }
  };

  const categories = Array.from(new Set(plans.map(p => p.category)));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pricing Plans</h1>
          <p className="text-slate-500 mt-1">Manage pricing and service plans</p>
        </div>
        <Link
          href="/admin/pricing/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Plan
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading pricing plans...</div>
        ) : plans.length === 0 ? (
          <div className="p-12 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 mb-4">No pricing plans found</p>
            <Link href="/admin/pricing/new" className="text-primary font-medium text-sm hover:underline">
              Add your first pricing plan
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Billing</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {plans.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-sm font-medium text-slate-900">{p.name}</span>
                        {p.popular && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">Popular</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{p.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900">
                        {p.currency} {p.price.toLocaleString()}
                      </span>
                      {p.originalPrice && (
                        <span className="ml-1.5 text-xs text-slate-400 line-through">{p.currency} {p.originalPrice.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 capitalize">{p.billingPeriod}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{p.order}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/pricing/edit/${p.id}`}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
