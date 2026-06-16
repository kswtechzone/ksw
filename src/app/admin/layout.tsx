'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, Briefcase, Users, Settings, HelpCircle,
  Menu, X, LogOut, ChevronRight, FolderKanban, Wrench, UserCheck, Package, Clock, TrendingUp,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { API } from '@/constants/api';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/portfolios', label: 'Portfolios', icon: FolderKanban },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/teams', label: 'Team', icon: Users },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/faqs', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/job-applications', label: 'Applications', icon: UserCheck },
  { href: '/admin/pricing', label: 'Pricing', icon: TrendingUp },
  { href: '/admin/timeline', label: 'Timeline', icon: Clock },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) setAdminUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch(API.AUTH.LOGOUT, { method: 'POST' });
    } catch {
      // ignore — still clear local state
    }
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('admin_device_id');
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  }, [router]);

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-700">
          <Link href="/admin/dashboard" className="font-bold text-lg text-slate-900 dark:text-white">
            KSW <span className="text-primary">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {active && <ChevronRight className="h-3 w-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-slate-700 dark:text-slate-200">{adminUser?.username || 'Admin'}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Administrator</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Sign Out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm text-slate-400 dark:text-slate-500">
            {navItems.find(i => pathname.startsWith(i.href))?.label || 'Admin'}
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 lg:p-8 text-slate-900 dark:text-slate-100">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
