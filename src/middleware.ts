import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';

const publicPaths = [
  '/',
  '/about',
  '/services',
  '/products',
  '/portfolio',
  '/blog',
  '/careers',
  '/contact',
  '/admin/login',
  '/_next',
  '/api/auth',
  '/api/blogs',
  '/api/contacts',
  '/api/jobs',
  '/api/portfolios',
  '/api/teams',
  '/api/services',
  '/api/faqs',
  '/api/settings',
  '/api/job-applications',
  '/api/products',
  '/api/pricing',
  '/api/admin',
  '/api/upload',
  '/favicon.ico',
  '/favicon.png',
  '/robots.txt',
  '/sitemap.xml',
  '/og-image.png',
  '/sw.js',
];

const RATE_LIMITS: Record<string, { max: number; window: number }> = {
  default: { max: 60, window: 60000 },
  '/api/auth': { max: 10, window: 60000 },
  '/api/upload': { max: 20, window: 60000 },
  '/api/contacts': { max: 5, window: 60000 },
  '/admin/login': { max: 10, window: 60000 },
};

function getRateLimitConfig(path: string) {
  for (const [prefix, config] of Object.entries(RATE_LIMITS)) {
    if (path.startsWith(prefix)) return config;
  }
  return RATE_LIMITS.default;
}

function setSecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https:; frame-src 'none'; object-src 'none'"
  );
}

function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const { hostname } = new URL(origin);
    const corsVar = process.env.CORS_ORIGINS || 'http://localhost:3000';
    const allowedHosts = corsVar.split(',').map(u => {
      try { return new URL(u.trim()).hostname; } catch { return ''; }
    }).filter(Boolean);
    allowedHosts.push('localhost', '127.0.0.1');
    return allowedHosts.some(h => hostname === h || hostname.endsWith('.' + h));
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const start = performance.now();

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204 });
  }

  if (request.method !== 'GET' && !isValidOrigin(request)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const response = NextResponse.next();
  setSecurityHeaders(response);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  const country = request.geo?.country;
  if (country) response.headers.set('x-geo-country', country);

  const rateConfig = getRateLimitConfig(pathname);
  const rateKey = `${ip}:${pathname.split('/').slice(0, 3).join('/')}`;
  const rateResult = checkRateLimit(rateKey, rateConfig.max, rateConfig.window);

  response.headers.set('X-RateLimit-Limit', String(rateConfig.max));
  response.headers.set('X-RateLimit-Remaining', String(rateResult.remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(rateResult.resetAt / 1000)));

  if (!rateResult.allowed) {
    console.warn('Rate limit exceeded:', request.method, pathname);
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((rateResult.resetAt - Date.now()) / 1000)),
        ...Object.fromEntries(response.headers.entries()),
      },
    });
  }

  console.log(`${request.method} ${pathname}`);

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  if (!isPublic && pathname.startsWith('/admin')) {
    const adminCookie = request.cookies.get('auth_token');
    if (!adminCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname === '/admin/login') {
      return response;
    }

    try {
      const { jwtVerify } = await import('jose');
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-change-in-production');
      const { payload } = await jwtVerify(adminCookie.value, secret);
      const adminId = payload.sub as string;

      if (adminId) {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        const admin = await (prisma as any).admin.findUnique({
          where: { id: adminId },
        });
        await prisma.$disconnect();

        const isActive = admin ? (admin as any).isActive !== false : false;
        if (!admin || !isActive) {
          const loginUrl = new URL('/admin/login', request.url);
          const redirectResponse = NextResponse.redirect(loginUrl);
          redirectResponse.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
          return redirectResponse;
        }

        response.headers.set('X-Admin-Role', (admin as any).role || 'ADMIN');
      }
    } catch {
      const loginUrl = new URL('/admin/login', request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
