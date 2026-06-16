# KSW TechZone - System Architecture

## Overview

KSW TechZone is a modern Next.js 14 application (App Router) with:
- **API Routes** under `src/app/api/` — all backend logic lives here
- **Prisma ORM** connected to PostgreSQL
- **Nginx** reverse proxy with SSL termination
- **Docker** containerization for production

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         DNS (Cloudflare)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      Nginx Reverse Proxy                     │
│                       kswtechzone.com                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                       Next.js App                            │
│                        :3000                                 │
│                                                              │
│  • App Router (SSR/SSG/ISR)                                  │
│  • API Routes (auth, blog, contact, etc.)                    │
│  • Prisma ORM → PostgreSQL                                   │
│  • JWT Auth with jose                                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    PostgreSQL Database                       │
│  users | accounts | sessions | blogs | portfolios | jobs    │
└─────────────────────────────────────────────────────────────┘
```

## RBAC Design

### Roles
- **USER** - Default role for registered users
- **VENDOR** - Service providers
- **MANAGER** - Platform managers with elevated permissions
- **ADMIN** - System administrators
- **SUPER_ADMIN** - Full system access

### Permission Strategy
- Roles are stored in user metadata
- Roles are included in JWT tokens as custom claims
- API route handlers verify roles before processing requests
