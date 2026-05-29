# Plan: Integración de Autenticación y control de acceso por rol (RBAC)

> Estado: **propuesta / no implementado**. Documento de planificación para el módulo de Auth de SunStay.

## Contexto / por qué ahora

El login del frontend es actualmente un placeholder sin backend, y CLAUDE.md §18 exige que el
enforcement de permisos sea **en el backend** (no solo rutas protegidas en el front). La capa de datos
ya está lista: el seed (`apps/api/prisma/seed.ts`) crea el usuario administrador
(`admin@sunstay.local`) con hash argon2id y la matriz completa `RoleModulePermission` por rol/módulo.
Autenticación desbloquea todos los módulos de negocio siguientes.

## Decisión clave: runtime de hashing

El seed hashea con `Bun.password.hash` (argon2id). La verificación en login **debe usar el mismo
mecanismo**. Decisión tomada (2026-05-29): **usar `Bun.password.verify` y correr la API bajo el runtime
Bun** (alineado con CLAUDE.md §3.1 / §11).

- Riesgo a verificar al implementar: `nest start` puede delegar la ejecución a Node, donde
  `Bun.password` no existe y el login fallaría. Arrancar con `bun --watch apps/api/src/main.ts`
  (o equivalente que ejecute bajo Bun) en lugar de delegar el runtime a Node.
- Alternativa descartada: `@node-rs/argon2` (portable, verifica el hash PHC estándar independiente del
  runtime).

## Backend — `apps/api/src/auth/`

Dependencia nueva: `@nestjs/jwt` (firma/verificación JWT con `JWT_SECRET` / `JWT_EXPIRES_IN`, ya en
`.env`). Guard propio, sin passport, para mantenerlo simple y compatible con Bun.

| Archivo | Responsabilidad |
|---|---|
| `auth.module.ts` | Registra `JwtModule` (secret + expiresIn desde env), expone controller/service/guards |
| `dto/login.dto.ts` | `email` + `password` validados con `class-validator` |
| `auth.service.ts` | `validateUser()` (busca user activo + rol, verifica password con `Bun.password.verify`), `login()` (emite JWT con `sub`, `email`, `roleId`), `me()` (carga permisos del rol) |
| `auth.controller.ts` | `POST /api/auth/login`, `GET /api/auth/me` |
| `guards/jwt-auth.guard.ts` | Valida el Bearer token; registrado global con excepción `@Public()` |
| `guards/permissions.guard.ts` | Lee `RoleModulePermission` y exige el flag (`canView` / `canCreate` / …) declarado por `@RequirePermission(modulo, accion)` |
| `decorators/public.decorator.ts`, `current-user.decorator.ts`, `require-permission.decorator.ts` | Metadata + extracción de usuario |

- Reutiliza el `PrismaService` global ya disponible.
- El `JwtAuthGuard` global se registra con `APP_GUARD`; rutas como login/health se marcan `@Public()`.
- El enforcement por módulo cumple CLAUDE.md §18 ("permission checks before executing protected use cases").

## Frontend — `apps/web/features/auth/` + `lib/`

- Conectar `app/login/page.tsx` a `api.post('/auth/login')` (convertir el form estático en client
  component con estado), guardar el token (cookie httpOnly vía route handler, o `localStorage` para esta
  fase) y redirigir a `/dashboard`.
- `lib/auth.ts`: helpers de sesión + adjuntar `Authorization: Bearer` en `lib/api.ts`.
- `GET /me` para resolver permisos y construir el sidebar/menú a partir de los módulos permitidos por rol.
- `middleware.ts`: proteger rutas internas (redirige a `/login` sin sesión).

## Documentación a actualizar

- `docs/api.md` — endpoints `/auth/login` y `/auth/me`, formato de token y errores 401/403.
- `docs/architecture.md` — capa de auth, guards globales, flujo de permisos.
- `docs/requirements.md` — si se ajusta algún detalle del flujo de acceso.

## Verificación end-to-end

1. `bun install` (nuevas deps).
2. `bun run dev:api` → `POST /api/auth/login` con `admin@sunstay.local` / `ChangeMe123!` devuelve token;
   con credenciales malas → 401.
3. `GET /api/auth/me` con el Bearer → datos del usuario + permisos; sin token → 401.
4. Un endpoint protegido con `@RequirePermission` accedido por un rol sin el flag → 403.
5. `bun run dev:web` → login real redirige a `/dashboard`; sidebar muestra solo módulos permitidos.
6. `bun run build:api` y `build:web` OK.
