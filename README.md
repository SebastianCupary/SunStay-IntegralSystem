# SunStay

Internal hotel management system for **Hotel Tropical Sun**.

## Stack

- **Frontend:** Next.js + TypeScript
- **Backend:** NestJS + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **API:** REST
- **Package Manager:** Bun
- **Containers:** Docker
- **Cloud:** Azure

## Structure

```
sunstay/
├── apps/web/          Next.js frontend
├── apps/api/          NestJS backend
├── packages/shared/   Shared types, constants, validators
├── packages/ui/       Shared UI components and design tokens
├── docker/            Dockerfiles and configs
└── docs/              Project documentation
```

## Getting started

1. Clone the repository
2. Copy `.env.example` to `.env` and configure variables
3. Run `bun install`
4. Start infrastructure: `docker compose up -d`
5. Run database migrations: `bun --filter @sunstay/api prisma:migrate dev`
6. Start development: `bun dev:api` and `bun dev:web`
