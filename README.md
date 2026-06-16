# KSW TechZone - Corporate Website + SSO Platform

Enterprise-grade corporate website and centralized authentication ecosystem for KSW TechZone.

## Architecture

```
┌────────────────────────────────────┐
│    Next.js 14 (App Router)         │
│  + TypeScript + Tailwind + Framer  │
├────────────────────────────────────┤
│    NestJS Backend Microservices     │
│  + PostgreSQL + Prisma + Redis     │
├────────────────────────────────────┤

├────────────────────────────────────┤
│    Docker + Nginx + VPS            │
└────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion, GSAP |
| UI | Shadcn UI, Radix UI, Lucide Icons |
| Backend | NestJS, Node.js, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Cache | Redis |
| Auth | JWT |
| Deployment | Docker, Nginx, VPS |
| CI/CD | GitHub Actions |

## Features

### Website
- Modern, premium UI with glassmorphism & animations
- Dark/light mode
- Full SEO optimization (Lighthouse 95+)
- Responsive design
- Blog with categories, tags, search
- Careers with job listings
- Portfolio with filtering
- Contact form with multi-plan selection & localStorage persistence
- Interactive tic-tac-toe game with minimax AI on the home page

### KSW Account (SSO)
- Role-based access control (RBAC)
- User profile management
- Session management
- Cross-application SSO

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development
npm run dev
```

## Project Structure

```
ksw-website2/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # Shadcn UI components
│   │   ├── layout/      # Layout components
│   │   ├── home/        # Home page sections
│   │   └── ...          # Feature components
│   ├── lib/             # Utilities & helpers
│   ├── hooks/           # Custom hooks
│   └── types/           # TypeScript types
├── packages/
│   └── auth/            # Reusable auth package
├── backend/
│   └── src/             # NestJS backend
│       ├── services/    # Microservices
│       └── common/      # Shared guards, decorators
├── prisma/
│   └── schema.prisma    # Database schema
├── docker/              # Docker & Nginx config
└── docs/                # Documentation
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security Architecture](docs/SECURITY.md)

## Products

- **KSW Hospitality** - Multi-tenant hospitality management SaaS
- **Ghantaghar.com** - Hourly hotel booking platform
- **Hourly Place** - Hourly booking for spaces
- **KSW Marketing** - Digital marketing division
- **KIRA** - IoT & Robotics Association

## License

Private - KSW TechZone
