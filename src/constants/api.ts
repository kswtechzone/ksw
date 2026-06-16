const API_BASE = '';

export const API = {
  BASE: API_BASE,
  AUTH: {
    LOGIN: `${API_BASE}/api/auth/admin-login`,
    LOGOUT: `${API_BASE}/api/auth/admin-logout`,
  },
  BLOGS: `${API_BASE}/api/blogs`,
  CONTACTS: `${API_BASE}/api/contacts`,
  JOBS: `${API_BASE}/api/jobs`,
  PORTFOLIOS: `${API_BASE}/api/portfolios`,
  TEAMS: `${API_BASE}/api/teams`,
  SERVICES: `${API_BASE}/api/services`,
  FAQS: `${API_BASE}/api/faqs`,
  SETTINGS: `${API_BASE}/api/settings`,
  ADMIN_STATS: `${API_BASE}/api/admin/stats`,
  JOB_APPLICATIONS: `${API_BASE}/api/job-applications`,
  PRODUCTS: `${API_BASE}/api/products`,
  UPLOAD: `${API_BASE}/api/upload`,
  TIMELINE: `${API_BASE}/api/timeline`,
  PRICING: `${API_BASE}/api/pricing`,
  PRICING_BY_SERVICE: (serviceSlug: string) => `${API_BASE}/api/pricing/service/${serviceSlug}`,
};
