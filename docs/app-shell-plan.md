# Plan: Shell autenticado (layout interno + sidebar RBAC + header con perfil)

> Estado: **propuesta / no implementado**. Documento de planificación para el shell autenticado de SunStay.

## Contexto

Auth quedó implementado y verificado (login real, `/auth/me`, guards RBAC, `proxy.ts`). Pero el
`/dashboard` es una página suelta: no hay layout interno, ni sidebar, ni header con menú de perfil, que
exigen CLAUDE.md §8 y §9. Además quedaron tres cabos sueltos de la review de Auth: el `logout`
(`clearAuthSession`) es código muerto, `proxy.ts` agrega `?redirectTo=` que el login ignora, y la lista de
módulos vive inline en el dashboard. Este shell es la base donde vivirán todos los módulos de negocio:
genera la navegación a partir de los permisos que ya retorna `/auth/me` y completa el menú de perfil.

**Sin cambios de backend** (salvo limpieza opcional): `/auth/me` ya devuelve `user` + `permissions`
(cada uno con `module.code/name/route` y flags `canView…`). Reutilizamos eso.

## Reutilizar lo existente

- `apps/web/lib/auth.ts` → `AuthUser`, `AuthPermission`, `clearAuthSession`, `getAuthToken`.
- `apps/web/lib/api.ts` → `api.get<AuthUser>("/auth/me")` (ya desempaqueta el sobre `{data}`).
- `apps/web/features/auth/allowed-modules.tsx` → patrón de fetch a `/auth/me`; queda **superseded** por el sidebar (se elimina o vacía).
- Tokens de diseño en `apps/web/app/globals.css` (colores, `--spacing-unit`, radios).
- Rutas de módulos desde el seed (12 `SystemModule` con su `route`).

## Cambios — Frontend

### 1. Contexto de sesión (cliente)
`apps/web/features/auth/auth-context.tsx` (nuevo): `AuthProvider` + hook `useAuth()`. Hace **un** fetch a
`/auth/me` al montar, expone `{ user, permissions, loading }`. Si `/auth/me` responde 401 (token expirado),
llama `clearAuthSession()` y redirige a `/login`. Evita que cada página/módulo re-consulte.

### 2. Route group interno con layout compartido
- `apps/web/app/(internal)/layout.tsx` (nuevo): envuelve `children` en `<AuthProvider>` + `<AppShell>`.
- **Mover** dentro de `app/(internal)/` las rutas internas actuales (el route group **no cambia la URL**):
  `dashboard/`, `reservations/`, `guests/`, `rooms/`, `billing/`, `inventory/`, `staff/`,
  `common-areas/`, `reports/`, `users/`, `roles/`, `profile/`. `login/` y `app/page.tsx` se quedan fuera
  (sin shell).

### 3. Componentes de layout (`apps/web/components/layout/`, per §3/§4)
- `app-shell.tsx`: compone sidebar + header + área de contenido (grid desktop-first).
- `sidebar.tsx`: navegación desde `useAuth().permissions.filter(p => p.canView)` → `module.route` +
  `module.name`; resalta la ruta activa con `usePathname()`.
- `header.tsx`: título/breadcrumb del módulo activo + `<ProfileMenu>`.
- `profile-menu.tsx`: dropdown con los ítems de §8 (Mi Perfil, Configuración de cuenta, Cambiar
  contraseña, Notificaciones, Ayuda, **Cerrar sesión**). "Cerrar sesión" llama `clearAuthSession()` +
  `router.push("/login")`; el resto enlaza a `/profile` o queda como placeholder en esta fase.

### 4. Fixes de la review de Auth
- `apps/web/features/auth/login-form.tsx`: honrar `redirectTo` vía `useSearchParams().get("redirectTo")`
  (fallback `/dashboard`). **Nota Next:** envolver `<LoginForm>` en `<Suspense>` dentro de
  `app/login/page.tsx` (o marcar la página dinámica) porque `useSearchParams` fuerza CSR bailout en build.
- `apps/web/app/(internal)/dashboard/page.tsx`: quitar `AllowedModules` inline (ya está en el sidebar);
  dejar bienvenida + placeholders de KPI.
- `apps/web/app/(internal)/profile/page.tsx` (nuevo): placeholder mínimo (la ruta ya es prefijo protegido
  en `proxy.ts` y destino del menú de perfil).

### 5. Limpieza opcional backend
Quitar el endpoint de prueba `GET /api/auth/admin-check` de `apps/api/src/auth/auth.controller.ts`
(servía para verificar RBAC; ya no se necesita).

## Cambios — Documentación (CLAUDE.md §10)

- `docs/design.md` — patrones de shell, sidebar, header, menú de perfil, breadcrumb, y navegación
  derivada de permisos (RBAC). Es obligatorio al cambiar layout/navegación.
- `docs/architecture.md` — `AuthProvider` (contexto de sesión) y el route group `(internal)`.

## Verificación end-to-end

1. `bun run dev:api` + `bun run dev:web`.
2. Login como `admin@sunstay.local` → aterriza en `/dashboard` dentro del shell; el sidebar muestra los
   **12 módulos** (rol Administrator).
3. (Si hay otro usuario/rol) un Receptionist ve solo su subconjunto `canView` — el enforcement real ya lo
   da el backend; el sidebar refleja los mismos permisos.
4. Navegar entre módulos resalta el ítem activo; el header muestra el título correcto.
5. Menú de perfil → "Cerrar sesión" limpia `localStorage` + cookie y redirige a `/login`; `proxy.ts`
   bloquea volver a `/dashboard` sin token.
6. Estando deslogueado, abrir `/rooms` → `/login?redirectTo=/rooms` → tras login aterriza en `/rooms`.
7. `bun run build:web` y `bun run build:api` OK (sin warnings de `useSearchParams`).
