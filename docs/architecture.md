# SunStay Architecture

## Project Overview

SunStay is an internal hotel management system for Hotel Tropical Sun. It follows a monorepo structure with clear separation between frontend, backend, and shared packages.

## Created Structure

The project is organized as a pnpm monorepo with the following main areas:

### apps/web — Next.js Frontend

- **app/** — App Router pages for each business module (login, dashboard, reservations, guests, rooms, billing, inventory, staff, common-areas, reports)
- **components/** — Reusable UI components organized by type: layout, ui, tables, forms, modals, charts
- **features/** — Feature-based modules for business domain logic (reservations, guests, rooms, billing, inventory, staff, common-areas, reports)
- **hooks/** — Custom React hooks
- **lib/** — Utility functions and helpers
- **styles/** — Global styles and design tokens
- **types/** — TypeScript type definitions
- **public/** — Static assets

### apps/api — NestJS Backend

- **src/config/** — Application configuration
- **src/common/** — Shared utilities, interceptors, filters, pipes
- **src/modules/** — Business modules: reservations, guests, rooms, billing, inventory, staff, attendance, common-areas, reports, users, roles
- **src/database/** — Database service and Prisma client configuration
- **src/auth/** — Authentication and authorization logic
- **prisma/** — Prisma schema and migrations

### packages/shared

- **types/** — Shared TypeScript interfaces and types across frontend and backend
- **constants/** — Shared constants and enumerations
- **validators/** — Shared validation schemas

### packages/ui

- **components/** — Shared UI components used across the frontend
- **tokens/** — Design tokens (colors, spacing, typography, badges)

### docker

- Dockerfiles for web and API services
- PostgreSQL initialization scripts

### docs

- **architecture.md** — This file: architecture documentation
- **database.md** — Database schema and entity documentation
- **api.md** — API endpoints and usage documentation
- **design.md** — UI/UX design decisions
- **requirements.md** — Business and functional requirements
- **AGENTS.md** — Project agent instructions and conventions

## Technology Stack

| Component          | Technology                       |
|--------------------|----------------------------------|
| Frontend           | Next.js + TypeScript             |
| Backend            | NestJS + TypeScript              |
| Database           | PostgreSQL                       |
| ORM                | Prisma ORM                       |
| API Style          | REST                             |
| Package Manager    | pnpm                             |
| Containers         | Docker + Docker Compose          |
| Cloud Target       | Azure                            |

## Architecture Principles

- Monorepo with clear package boundaries
- Modular backend (one NestJS module per business domain)
- Feature-based frontend organization
- Shared types and validators to ensure consistency between frontend and backend
- REST API communication between frontend and backend
- Prisma ORM for all database access
- Role-based access control
- Docker-based local development
- Cloud-portable configuration via environment variables
