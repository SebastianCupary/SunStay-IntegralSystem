# SunStay Design System and UX Documentation

## 1. Purpose

This document defines the design, UX, layout, component, and frontend implementation rules for **SunStay**, the internal hotel management system for **Hotel Tropical Sun**.

The document is written in English to reduce token usage and improve compatibility with AI-assisted development tools. However, all user-facing UX copy, labels, statuses, button names, tables, filters, and form fields must remain in **Spanish**, because the system will be used by hotel staff in Bolivia.

---

## 2. Product Context

**SunStay** is an internal administrative platform for hotel operations. It is not a public booking website and guests do not interact directly with the system.

Main users:

- Administrador
- Recepcionista
- Encargado de Inventario
- Gerencia
- Personal Operativo, only when explicitly allowed

Core objective:

- centralize hotel operations;
- reduce manual records;
- improve reservations, guests, rooms, billing, inventory, staff, common areas, reports, and user access control;
- provide clear operational visibility for daily hotel work.

---

## 3. Selected Technology Stack

### 3.1 Frontend

- Framework: **Next.js**
- Router: **App Router**
- Language: **TypeScript**
- Runtime and package manager: **Bun**
- Styling: **Tailwind CSS**
- UI primitives: **Radix UI** or compatible accessible components
- Icons: **Lucide React**
- Charts: **Recharts**
- API communication: **REST**

### 3.2 Backend and Data Alignment

The design must align with:

- Backend: **NestJS**
- Database: **PostgreSQL**
- ORM: **Prisma ORM**
- API style: **REST**
- Containers: **Docker**
- Cloud target: **Azure**

Frontend UI must not assume direct database access. All operational data must be treated as coming from the backend API.

### 3.3 Repository Alignment

Recommended frontend paths:

```txt
apps/web/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── styles/
├── types/
└── public/
```

Recommended shared package paths:

```txt
packages/ui/
├── components/
└── tokens/

packages/shared/
├── types/
├── constants/
└── validators/
```

Design tokens should be reusable and should not be duplicated manually across modules.

---

## 4. UX Language Policy

Documentation can be in English, but the visible interface must use Spanish.

Examples:

| Context | Use in UI |
|---|---|
| Dashboard title | `Dashboard` |
| Reservations | `Reservas` |
| Guests | `Huéspedes` |
| Rooms | `Habitaciones` |
| Billing | `Facturación` |
| Inventory | `Inventario` |
| Staff | `Personal` |
| Common Areas | `Áreas comunes` |
| Reports | `Reportes` |
| Users and Roles | `Usuarios y Roles` |
| New reservation | `Nueva Reserva` |
| Register guest | `Registrar Huésped` |
| Generate report | `Generar Reporte` |
| Export | `Exportar` |
| Save changes | `Guardar Cambios` |
| Cancel | `Cancelar` |

Statuses must also remain in Spanish:

- `Disponible`
- `Ocupada`
- `Limpieza`
- `Mantenimiento`
- `Pendiente`
- `Confirmada`
- `Check-in`
- `Check-out`
- `Cancelada`
- `Pagado`
- `Parcial`
- `Vencido`
- `Activo`
- `Vacaciones`
- `Permiso Médico`
- `Presente`
- `Ausente`

---

## 5. Visual Identity

### 5.1 Brand Colors

```css
--primary: #0d4c6f;
--accent: #f5a623;
--background: #f8f9fa;
--card: #ffffff;
```

### 5.2 Semantic Colors

```css
--success: #10b981;
--warning: #f59e0b;
--destructive: #dc2626;
--info: #3b82f6;
--muted: #f1f5f9;
--border: #e5e7eb;
--foreground: #111827;
--muted-foreground: #64748b;
```

### 5.3 Status Color Meaning

| Color | Meaning | Examples |
|---|---|---|
| Success | Positive or available state | `Disponible`, `Pagado`, `Presente`, `Activo` |
| Warning | Attention required | `Pendiente`, `Limpieza`, `Stock Bajo`, `Vacaciones` |
| Destructive | Critical or blocked state | `Cancelada`, `Mantenimiento`, `Agotado`, `Ausente` |
| Info | Informational or active process | `Check-in`, `En Uso`, `Parcial` |
| Default | Neutral state | `Finalizada`, `Inactivo` |

Do not rely only on color. Always show a clear text label.

---

## 6. Typography

Use a modern sans-serif font.

| Element | Size | Weight |
|---|---:|---:|
| Page title | 24px to 28px | 600 |
| Section title | 18px to 20px | 600 |
| Card title | 16px | 600 |
| Body | 14px | 400 |
| Metadata | 12px | 400 or 500 |
| Button | 14px | 500 |
| Badge | 12px | 500 |

Base font size: `14px`.

---

## 7. Spacing, Radius, and Elevation

Use an 8px spacing system.

Allowed spacing values:

```txt
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

Border radius:

| Component | Radius |
|---|---:|
| Cards | 12px |
| Inputs | 10px |
| Buttons | 10px |
| Modals | 16px |
| Badges | 6px |
| Drawers | 16px on visible edge when applicable |

Use subtle shadows only when needed. Avoid heavy gradients and excessive decoration.

---

## 8. Global Layout

### 8.1 Authenticated App Layout

```txt
┌─────────────────────────────────────────┐
│ Header                                  │
├───────────────┬─────────────────────────┤
│ Sidebar       │ Main content             │
│ fixed width   │ scrollable area          │
└───────────────┴─────────────────────────┘
```

Rules:

- Sidebar has fixed width.
- Header stays inside the main content width.
- Main content must use `max-width: 100%`.
- Page-level horizontal scroll is not allowed.
- Tables may scroll horizontally inside their own containers only.

### 8.2 Main Content Rule

```tsx
className="flex-1 overflow-x-hidden overflow-y-auto bg-background"
```

Main content padding:

```txt
32px desktop
24px tablet
16px mobile or compact screens
```

---

## 9. Responsive Rules

The system is desktop-first but must remain usable on common laptop widths.

Supported widths:

- 1536px and above
- 1440px
- 1366px
- 1280px
- 1024px tablet landscape

### 9.1 KPI Grids

Use responsive grids instead of forcing all KPIs into one row.

Examples:

```tsx
// 4 KPIs
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// 5 KPIs
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"

// 6 KPIs
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
```

### 9.2 Filters

Filters must wrap cleanly.

Rules:

- search input uses flexible width;
- dropdowns keep readable min-width;
- action buttons do not shrink;
- no filter section should create full-page horizontal scroll.

### 9.3 Tables

Tables must be wrapped in a scroll container.

```tsx
<div className="bg-card border border-border" style={{ maxWidth: '100%' }}>
  <div style={{ overflowX: 'auto', width: '100%' }}>
    <table style={{ width: '100%', minWidth: '1000px' }}>
      {/* rows */}
    </table>
  </div>
</div>
```

---

## 10. Core Components

### 10.1 Badge

Purpose: show statuses across all modules.

Variants:

- `success`
- `warning`
- `destructive`
- `info`
- `default`

Rules:

- always include visible text;
- never use color alone;
- keep labels short;
- use consistent status mapping across modules.

### 10.2 KPI Card

Purpose: show operational metrics and allow quick navigation when clickable.

Structure:

- icon;
- label;
- main value;
- optional trend;
- optional click behavior.

KPI cards must be actionable when they represent a module overview.

### 10.3 Administrative Table

Rules:

- row hover allowed;
- column headers use muted text;
- actions are grouped at the end;
- icons must include label, tooltip, or title;
- destructive actions require confirmation.

### 10.4 Modal

Standard modal sizes:

| Size | Width |
|---|---:|
| Small | 500px to 600px |
| Medium | 700px |
| Large | 800px to 900px |

Rules:

- header with title and close button;
- body with grouped sections;
- footer actions aligned to the right;
- max height: `90vh`;
- internal scroll when content is long.

### 10.5 Drawer

Use drawers for quick detail views without leaving the module.

Examples:

- product quick view;
- reservation quick view;
- guest summary;
- room detail.

---

## 11. Navigation and RBAC

### 11.1 Sidebar Modules

Sidebar labels in Spanish:

- `Dashboard`
- `Reservas`
- `Huéspedes`
- `Habitaciones`
- `Facturación`
- `Inventario`
- `Personal`
- `Áreas comunes`
- `Reportes`
- `Usuarios`

`Usuarios` is visible only to `Administrador`.

### 11.2 Role-Based Module Visibility

| Module | Administrador | Recepcionista | Encargado Inventario | Gerencia |
|---|---|---|---|---|
| Dashboard | Yes | Yes | Yes | Yes |
| Reservas | Yes | Yes | No | Read only |
| Huéspedes | Yes | Yes | No | Read only |
| Habitaciones | Yes | Yes | No | Read only |
| Facturación | Yes | Limited | No | Read only |
| Inventario | Yes | No | Yes | Read only |
| Personal | Yes | No | No | Read only |
| Áreas comunes | Yes | Yes | No | Read only |
| Reportes | Yes | No | Limited | Yes |
| Usuarios | Yes | No | No | No |

UI must hide unauthorized modules, but backend authorization remains mandatory.

---

## 12. Routes and UX Labels

Use English route names when useful for code consistency, but keep Spanish labels in UI.

| Route | UI label |
|---|---|
| `/` | Landing page |
| `/login` | `Iniciar Sesión` |
| `/dashboard` | `Dashboard` |
| `/reservations` | `Reservas` |
| `/guests` | `Huéspedes` |
| `/rooms` | `Habitaciones` |
| `/billing` | `Facturación` |
| `/inventory` | `Inventario` |
| `/staff` | `Personal` |
| `/common-areas` | `Áreas comunes` |
| `/reports` | `Reportes` |
| `/users` | `Usuarios y Roles` |
| `/profile` | `Mi Perfil` |

---

## 13. Module UX Specifications

### 13.1 Landing Page

Purpose: present SunStay as a professional internal hotel management system.

Required sections:

- Navbar with `Iniciar Sesión` button;
- hero section with product value proposition;
- problem section;
- feature section;
- module section;
- benefits by role;
- security section;
- final CTA;
- footer.

The landing page must not look like a guest booking website.

### 13.2 Login

UX labels:

- `Iniciar Sesión`
- `Correo electrónico`
- `Contraseña`
- `¿Olvidaste tu contraseña?`
- `Verificando...`

> Login uses the user **email** as the only credential (there is no username). See `api.md` §3 and `database.md` §18.2.

States:

- normal;
- loading;
- invalid credentials;
- expired session.

### 13.3 User Profile Menu

Header profile dropdown options:

- `Mi Perfil`
- `Configuración`
- `Cambiar Contraseña`
- `Notificaciones`
- `Ayuda`
- `Cerrar Sesión`

`Cerrar Sesión` must be visually separated and use destructive styling.

### 13.4 Dashboard

Purpose: daily operational overview.

Must include:

- KPI cards;
- quick actions;
- operational alerts;
- today section;
- occupancy and income chart;
- room status card;
- recent reservations table.

Quick actions:

- `Nueva Reserva`
- `Check-in`
- `Registrar Pago`
- `Movimiento`

Operational alerts must include:

- priority;
- source module;
- action button;
- dismiss or resolve state.

### 13.5 Reservations

UX label: `Gestión de Reservas`.

Must support:

- new reservation wizard;
- holder data;
- multiple guests;
- stay dates;
- room type;
- channel;
- room assignment;
- detail view;
- edit flow;
- check-in;
- check-out;
- cancellation.

Main statuses:

- `Pendiente`
- `Confirmada`
- `Check-in`
- `Check-out`
- `Cancelada`

New reservation flow:

1. `Datos del Titular`
2. `Detalles de la Estadía`
3. `Huéspedes`
4. `Asignación de Habitación`
5. `Resumen y Confirmación`

### 13.6 Guests

UX label: `Gestión de Huéspedes`.

Must support:

- `Registrar Huésped`;
- search and filters;
- guest cards or table;
- detail view with stay history;
- edit guest flow;
- new reservation from guest.

Required guest fields:

- `Nombre completo`
- `Documento / Pasaporte`
- `Teléfono`
- `Email`
- `Nacionalidad`
- `Año de nacimiento` (Guest.birthYear)
- `Sexo` (Guest.sex)
- `Profesión` (Guest.profession)
- `Ciudad de origen` (Guest.originCity)

Guest statuses:

- `Hospedado`
- `Anterior`
- `Frecuente`
- `Nuevo`

### 13.7 Rooms

UX label: `Gestión de Habitaciones`.

Must support:

- room KPIs;
- room cards;
- filters by status, type, floor;
- new room;
- edit room;
- room detail;
- assign reservation;
- change status.

Room statuses:

- `Disponible`
- `Ocupada`
- `Limpieza`
- `Mantenimiento`
- `Reservada`

Main room actions:

- `Ver`
- `Editar`
- `Asignar Reserva`
- `Cambiar Estado`

### 13.8 Billing

UX label: `Facturación`.

Must support:

- issue invoice;
- invoice search;
- invoice table;
- invoice detail;
- download PDF action;
- register payment;
- partial payment tracking.

Payment statuses:

- `Pagado`
- `Pendiente`
- `Parcial`
- `Vencido`

Payment methods:

- `Efectivo`
- `Tarjeta`
- `Transferencia`
- `QR`

Main actions:

- `Emitir Factura`
- `Descargar PDF`
- `Registrar Pago`
- `Anular`

### 13.9 Inventory

UX label: `Control de Inventario`.

Must support inventory by hotel area:

- `Desayuno`
- `Piscina`
- `Habitaciones`
- `Limpieza`

Required actions:

- `Registrar Movimiento`
- `Ver Movimientos`
- `Nuevo Producto`

Product fields:

- `Nombre`
- `Área`
- `Categoría`
- `Unidad`
- `Stock actual`
- `Stock mínimo`
- `Notas`

Stock statuses:

- `Normal`
- `Stock Bajo`
- `Agotado`

Movement types:

- `Entrada`
- `Salida`

Rules:

- insufficient stock must block output movements;
- low stock must be visible in alerts;
- movements must keep traceability.

### 13.10 Staff

UX label: `Control de Personal`.

Must support:

- staff list;
- staff detail;
- staff status;
- check-in and check-out actions;
- attendance view;
- status update.

Staff statuses (UX labels; stored values in `database.md` §11.1):

- `Activo` (stored: `Active`)
- `Vacaciones` (stored: `OnVacation`)
- `Permiso Médico` (stored: `MedicalLeave`)

Attendance statuses (derived UI states; reconciled with stored `attendanceStatus` in `database.md` §11.1):

- `Pendiente` (no attendance record yet)
- `Registrado` (entry recorded — stored `Present` / `Late`)
- `Salida Registrada` (exit recorded — stored `Completed`)
- `No Disponible` (stored `Absent` / `Permission`)

Main actions:

- `Registrar Entrada`
- `Registrar Salida`
- `Ver Detalle`
- `Cambiar Estado`

Rules:

- employees on `Vacaciones` or `Permiso Médico` cannot register attendance;
- check-out is enabled only after check-in;
- completed attendance disables both actions.

### 13.11 Common Areas

UX label: `Áreas Comunes`.

Must support:

- area cards;
- new common area;
- new reservation;
- today reservations;
- reservation history;
- area detail;
- edit and cancel reservations;
- mark area use.

Area statuses:

- `Disponible`
- `Ocupada`
- `Reservada`
- `Mantenimiento`

Reservation statuses:

- `Confirmada`
- `En Uso`
- `Finalizada`
- `Cancelada`

Main buttons:

- `Nueva Área Común`
- `Nueva Reserva`

Common area form fields:

- `Nombre`
- `Tipo`
- `Capacidad`
- `Estado`
- `Notas`

Reservation form fields:

- `Área`
- `Fecha`
- `Hora Inicio`
- `Hora Fin`
- `Responsable`
- `Número de Personas`
- `Notas`

Rules:

- prevent time conflicts;
- block reservations in maintenance areas;
- block capacity overflow or show strong warning;
- end time must be after start time.

### 13.12 Reports

UX label: `Reportes y Análisis`.

Must support:

- report type selection;
- analysis period;
- filters;
- preview;
- generate report;
- export report.

Main buttons:

- `Generar Reporte`
- `Exportar`

Export formats:

- `PDF`
- `Excel`

Report types:

- `Reservas`
- `Huéspedes`
- `Habitaciones`
- `Facturación`
- `Inventario`
- `Personal`
- `Áreas comunes`
- `Rendimiento mensual`

Keep current analytics:

- KPIs;
- occupancy trend;
- income and expenses;
- staff attendance;
- booking channel distribution;
- reservations by room type;
- executive summary.

### 13.13 Users and Roles

UX label: `Usuarios y Roles`.

Visible only to `Administrador`.

Must support:

- user list;
- create user;
- edit user;
- activate or deactivate user;
- reset password;
- assign role;
- view role permissions by module.

User statuses:

- `Activo`
- `Inactivo`
- `Bloqueado`

Roles:

- `Administrador`
- `Recepcionista`
- `Encargado de Inventario`
- `Gerencia`

User table columns:

- `Nombre`
- `Email`
- `Rol`
- `Estado`
- `Último acceso`
- `Acciones`

Actions:

- `Ver`
- `Editar`
- `Desactivar`
- `Restablecer contraseña`

---

## 14. Forms and Validation Patterns

### 14.1 Required Field Pattern

Use Spanish messages:

- `Este campo es obligatorio.`
- `Debe seleccionar una opción.`
- `Ingrese un valor válido.`

### 14.2 Common Validations

| Context | Validation |
|---|---|
| Dates | end date must be after start date |
| Reservations | assigned room is required before check-in |
| Guests | duplicate document is not allowed |
| Rooms | duplicate room number is not allowed |
| Billing | payment amount cannot exceed due balance |
| Inventory | output quantity cannot exceed available stock |
| Staff | check-out requires previous check-in |
| Common areas | time conflict is not allowed |
| Users | duplicate email is not allowed |

### 14.3 Feedback States

Every module must include:

- loading state;
- empty state;
- no results state;
- success feedback;
- validation error;
- confirmation for destructive actions.

---

## 15. API Integration Rules

Frontend components must interact with backend through REST services.

Recommended frontend service paths:

```txt
apps/web/lib/api/
├── auth.ts
├── users.ts
├── reservations.ts
├── guests.ts
├── rooms.ts
├── billing.ts
├── inventory.ts
├── staff.ts
├── common-areas.ts
└── reports.ts
```

Rules:

- no hardcoded production URLs;
- use environment variables;
- centralize API client logic;
- map backend DTOs to UI models when needed;
- UI must not expose database entities directly;
- unauthorized API responses must redirect to login or show access denied.

---

## 16. Environment and Bun Rules

The project migrated completely to **Bun**.

Allowed commands:

```bash
bun install
bun run dev
bun run build
bun run lint
bun run test
```

Rules:

- do not reintroduce `npm`, `yarn`, or `pnpm`;
- use `bun.lock`;
- update scripts using Bun-compatible commands;
- Docker files must run Bun-based install/build commands when targeting the frontend;
- documentation must mention Bun as the official runtime and package manager.

---

## 17. Accessibility Rules

Minimum accessibility requirements:

- readable contrast;
- visible focus states;
- labels for all form controls;
- buttons must have text or accessible label;
- statuses must include text;
- tables must use proper headers;
- modals must have close action and keyboard support;
- destructive actions require confirmation.

The system should follow the WCAG principles:

- perceivable;
- operable;
- understandable;
- robust.

---

## 18. Design-to-Code Rules

When generating or modifying UI:

1. keep the existing visual identity;
2. do not redesign from scratch unless explicitly requested;
3. use reusable components;
4. keep business modules separated;
5. keep Spanish UX labels;
6. keep English code names where appropriate;
7. avoid page-level horizontal overflow;
8. document relevant UI changes in `design.md`;
9. align UI behavior with RBAC rules;
10. do not add functionality that conflicts with requirements.

---

## 19. Recommended Feature Folder Structure

```txt
apps/web/features/
├── dashboard/
├── auth/
├── users/
├── reservations/
├── guests/
├── rooms/
├── billing/
├── inventory/
├── staff/
├── common-areas/
└── reports/
```

Each feature can contain:

```txt
components/
hooks/
services/
types.ts
utils.ts
```

Shared UI remains in:

```txt
packages/ui/components/
packages/ui/tokens/
```

---

## 20. Pending Design Considerations

Pending items to validate during implementation:

- final role-permission matrix;
- exact mobile support level;
- real PDF and Excel export design;
- audit log screens;
- notification center behavior;
- advanced report filters by module;
- real-time dashboard updates;
- dark mode decision;
- printable invoice template;
- offline/PWA behavior for internal operations.

---

## 21. Final Rule

SunStay must always look and behave like a professional internal hotel management system focused on:

- operational control;
- data centralization;
- role-based access;
- traceability;
- fast daily workflows;
- clear reports;
- consistent Spanish UX.
