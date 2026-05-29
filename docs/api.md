# SunStay API Documentation

## 1. Purpose

This document defines the REST API structure for **SunStay**, including the update required for the **Users, Roles, and Module Access Control** module.

SunStay uses a REST API built with **NestJS**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**, using **Bun** as the project runtime and package manager.

---

## 2. General API Rules

- Use REST resource-based routes.
- Use JSON request and response bodies.
- Protect internal endpoints with authentication.
- Apply role-based authorization before executing protected actions.
- Validate request bodies with DTOs.
- Return clear errors for validation, authentication, and authorization failures.

---

## 2.1 Bun API Tooling Rule

All API development commands, scripts, dependency installation, builds, tests, and Prisma commands must be executed through **Bun**. Documentation must use `bun install` and `bun run <script>` instead of npm, yarn, or pnpm commands.

---

## 3.1 Dashboard Endpoints

Dashboard data is aggregated from multiple modules. Specific endpoints are pending definition; interim approach uses existing module endpoints for KPI data.

> **Pending:** define `GET /api/dashboard/kpis` and related endpoints per FR-085–FR-094.

---

## 3. Authentication Endpoints

| Method | Route                       | Purpose                                                                                       | Access              |
| ------ | --------------------------- | --------------------------------------------------------------------------------------------- | ------------------- |
| POST   | `/api/auth/login`           | Authenticate internal user. Login credential is the unique **email**; there is no `username`. | Public              |
| POST   | `/api/auth/logout`          | Close current session.                                                                        | Authenticated       |
| GET    | `/api/auth/me`              | Return authenticated user profile and permissions.                                            | Authenticated       |
| PATCH  | `/api/auth/change-password` | Change own password.                                                                          | Authenticated       |
| POST   | `/api/auth/forgot-password` | Request password reset.                                                                       | Public / controlled |
| POST   | `/api/auth/reset-password`  | Complete password reset.                                                                      | Public / controlled |

---

## 4. User Management Endpoints

Only users with the **Administrator** role can access user administration endpoints.

| Method | Route                           | Purpose                                      |
| ------ | ------------------------------- | -------------------------------------------- |
| GET    | `/api/users`                    | List users with filters.                     |
| POST   | `/api/users`                    | Create internal user.                        |
| GET    | `/api/users/:id`                | View user detail.                            |
| PATCH  | `/api/users/:id`                | Update user information.                     |
| PATCH  | `/api/users/:id/status`         | Change user status.                          |
| PATCH  | `/api/users/:id/role`           | Assign or change user role.                  |
| POST   | `/api/users/:id/reset-password` | Generate temporary password or reset action. |
| GET    | `/api/users/:id/activity`       | View user access or administration history.  |

### User filters

Supported filters:

- name
- email
- role
- status
- lastAccessAt

### User status values

- Active
- Inactive
- Blocked

---

## 5. Role and Permission Endpoints

Only Administrator users can manage roles and permissions.

| Method | Route                        | Purpose                                        |
| ------ | ---------------------------- | ---------------------------------------------- |
| GET    | `/api/roles`                 | List roles.                                    |
| POST   | `/api/roles`                 | Create role.                                   |
| GET    | `/api/roles/:id`             | View role detail.                              |
| PATCH  | `/api/roles/:id`             | Update role information.                       |
| GET    | `/api/roles/:id/permissions` | View role permissions.                         |
| PATCH  | `/api/roles/:id/permissions` | Update module permissions by role.             |
| GET    | `/api/system-modules`        | List system modules available for permissions. |

---

## 6. Permission Model

Permissions are applied by role and module.

Recommended permission flags:

| Permission | Meaning                                          |
| ---------- | ------------------------------------------------ |
| canView    | Allows viewing a module.                         |
| canCreate  | Allows creating records.                         |
| canUpdate  | Allows updating records.                         |
| canDelete  | Allows deleting, cancelling, or voiding records. |
| canExport  | Allows exporting data or reports.                |
| canManage  | Allows administrative management actions.        |

---

## 7. Access-Control Response Contract

The `/api/auth/me` endpoint must return enough information for frontend access control.

Example response structure:

```json
{
  "id": "user-id",
  "fullName": "María González",
  "email": "maria@sunstay.com",
  "role": "Administrator",
  "status": "Active",
  "permissions": [
    {
      "module": "Reservations",
      "route": "/reservations",
      "canView": true,
      "canCreate": true,
      "canUpdate": true,
      "canDelete": true,
      "canExport": true,
      "canManage": true
    }
  ]
}
```

---

## 8. Error Handling

| Scenario                        | Recommended Status |
| ------------------------------- | ------------------ |
| Invalid credentials             | 401 Unauthorized   |
| User inactive or blocked        | 403 Forbidden      |
| Authenticated but no permission | 403 Forbidden      |
| Validation error                | 400 Bad Request    |
| Resource not found              | 404 Not Found      |
| Duplicate user email            | 409 Conflict       |

---

## 8.1 Stays (Check-in / Check-out)

There is no standalone `Stay` module. Check-in and check-out are part of the **Reservations** module and exposed as sub-resources of a reservation. The `Stay` entity (see `database.md`) is created and updated through these endpoints.

| Method | Route                             | Purpose                                             |
| ------ | --------------------------------- | --------------------------------------------------- |
| POST   | `/api/reservations/:id/check-in`  | Register guest check-in and create/update the stay. |
| POST   | `/api/reservations/:id/check-out` | Register guest check-out and close the stay.        |
| GET    | `/api/reservations/:id/stay`      | View the stay linked to a reservation.              |

---

## 9. Reservations

Reservations include guests, rooms, and stay management. Only users with appropriate role permissions can access these endpoints.

| Method | Route                                  | Purpose                                             | Access        |
| ------ | -------------------------------------- | --------------------------------------------------- | ------------- |
| GET    | `/api/reservations`                    | List reservations with filters.                     | Authenticated |
| POST   | `/api/reservations`                    | Create a new reservation.                           | Authenticated |
| GET    | `/api/reservations/:id`                | View reservation detail.                            | Authenticated |
| PATCH  | `/api/reservations/:id`                | Update reservation data.                            | Authenticated |
| POST   | `/api/reservations/:id/cancel`         | Cancel a reservation.                               | Authenticated |
| GET    | `/api/reservations/:id/status-history` | View reservation status history.                    | Authenticated |
| POST   | `/api/reservations/:id/check-in`       | Register guest check-in and create/update the stay. | Authenticated |
| POST   | `/api/reservations/:id/check-out`      | Register guest check-out and close the stay.        | Authenticated |
| GET    | `/api/reservations/:id/stay`           | View the stay linked to a reservation.              | Authenticated |

Supported filters: status, checkInDate, checkOutDate, holderName, guestName, roomId, reservationChannel, roomTypeId.

---

## 10. Guests

Guest records are managed by reception staff. Guests may be linked to multiple reservations.

| Method | Route                                      | Purpose                                      | Access        |
| ------ | ------------------------------------------ | -------------------------------------------- | ------------- |
| GET    | `/api/guests`                              | List guests with filters.                    | Authenticated |
| POST   | `/api/guests`                              | Register a new guest.                        | Authenticated |
| GET    | `/api/guests/:id`                          | View guest detail and stay history.          | Authenticated |
| PATCH  | `/api/guests/:id`                          | Update guest information.                    | Authenticated |
| GET    | `/api/guests/:id/reservations`             | View guest reservation history.              | Authenticated |
| GET    | `/api/guests/:id/common-area-reservations` | View common area reservations for the guest. | Authenticated |

Supported filters: name, identityDocument, nationality.

---

## 11. Rooms

Room management includes availability, status changes, and assignment.

| Method | Route                           | Purpose                                 | Access        |
| ------ | ------------------------------- | --------------------------------------- | ------------- |
| GET    | `/api/rooms`                    | List rooms with filters.                | Authenticated |
| POST   | `/api/rooms`                    | Register a new room.                    | Authenticated |
| GET    | `/api/rooms/:id`                | View room detail.                       | Authenticated |
| PATCH  | `/api/rooms/:id`                | Update room information or status.      | Authenticated |
| GET    | `/api/rooms/:id/status-history` | View room status history.               | Authenticated |
| GET    | `/api/rooms/:id/availability`   | Check room availability for date range. | Authenticated |

Supported filters: status, roomTypeId, floor.

---

## 12. Billing and Payments

Invoices are linked to reservations. Partial payments are tracked via Invoice.paymentStatus.

| Method | Route                               | Purpose                                    | Access        |
| ------ | ----------------------------------- | ------------------------------------------ | ------------- |
| GET    | `/api/billing/invoices`             | List invoices.                             | Authenticated |
| POST   | `/api/billing/invoices`             | Issue invoice for a reservation.           | Authenticated |
| GET    | `/api/billing/invoices/:id`         | View invoice detail.                       | Authenticated |
| PATCH  | `/api/billing/invoices/:id/payment` | Register payment or update payment status. | Authenticated |
| GET    | `/api/billing/invoices/:id/pdf`     | Download invoice as PDF.                   | Authenticated |

Supported filters: paymentStatus, paymentMethod, issueDate.

---

## 13. Inventory

Inventory management is organized by hotel area. Low-stock alerts must be generated when stock is at or below minimum.

| Method | Route                         | Purpose                                      | Access        |
| ------ | ----------------------------- | -------------------------------------------- | ------------- |
| GET    | `/api/inventory/areas`        | List inventory areas.                        | Authenticated |
| POST   | `/api/inventory/areas`        | Create inventory area.                       | Authenticated |
| GET    | `/api/inventory/products`     | List products.                               | Authenticated |
| POST   | `/api/inventory/products`     | Register a product.                          | Authenticated |
| PATCH  | `/api/inventory/products/:id` | Update product information.                  | Authenticated |
| GET    | `/api/inventory/stock`        | List current stock by area and product.      | Authenticated |
| POST   | `/api/inventory/movements`    | Register inventory movement (entry or exit). | Authenticated |
| GET    | `/api/inventory/movements`    | List inventory movements with filters.       | Authenticated |
| GET    | `/api/inventory/alerts`       | List low-stock alerts.                       | Authenticated |

Supported filters: area, category, stockStatus.

---

## 14. Staff and Attendance

Staff records are managed by administrators. Attendance tracks daily check-in and check-out.

| Method | Route                              | Purpose                                     | Access        |
| ------ | ---------------------------------- | ------------------------------------------- | ------------- |
| GET    | `/api/staff`                       | List staff members.                         | Authenticated |
| POST   | `/api/staff`                       | Create staff record.                        | Authenticated |
| GET    | `/api/staff/:id`                   | View staff detail.                          | Authenticated |
| PATCH  | `/api/staff/:id`                   | Update staff information or status.         | Authenticated |
| GET    | `/api/attendance`                  | List attendance records.                    | Authenticated |
| POST   | `/api/attendance/check-in`         | Register daily staff check-in.              | Authenticated |
| POST   | `/api/attendance/check-out`        | Register daily staff check-out.             | Authenticated |
| GET    | `/api/attendance/:staffId/history` | View attendance history for a staff member. | Authenticated |
| GET    | `/api/access-control`              | List staff access control records.          | Authenticated |
| POST   | `/api/access-control`              | Register staff access movement.             | Authenticated |

Supported filters: date, staffId, attendanceStatus.

---

## 15. Common Areas

Common area reservations must be linked to a guest and cannot overlap in time.

| Method | Route                                       | Purpose                                   | Access        |
| ------ | ------------------------------------------- | ----------------------------------------- | ------------- |
| GET    | `/api/common-areas`                         | List common areas.                        | Authenticated |
| POST   | `/api/common-areas`                         | Create common area.                       | Authenticated |
| GET    | `/api/common-areas/:id`                     | View common area detail and availability. | Authenticated |
| PATCH  | `/api/common-areas/:id`                     | Update common area.                       | Authenticated |
| GET    | `/api/common-areas/:id/reservations`        | List reservations for a common area.      | Authenticated |
| POST   | `/api/common-areas/reservations`            | Create common area reservation.           | Authenticated |
| PATCH  | `/api/common-areas/reservations/:id`        | Update common area reservation.           | Authenticated |
| POST   | `/api/common-areas/reservations/:id/cancel` | Cancel common area reservation.           | Authenticated |

Supported filters: date, area, status.

---

## 16. Reports

Reports are generated based on operational data. The system stores report metadata and optional summary details.

| Method | Route                     | Purpose                                        | Access        |
| ------ | ------------------------- | ---------------------------------------------- | ------------- |
| GET    | `/api/reports`            | List generated reports.                        | Authenticated |
| POST   | `/api/reports`            | Generate a new report.                         | Authenticated |
| GET    | `/api/reports/:id`        | View report metadata and details.              | Authenticated |
| GET    | `/api/reports/:id/export` | Export report in specified format (PDF/Excel). | Authenticated |

Supported filters: reportType, generatedBy, startDate, endDate.

---

## 17. Documentation Notes

Any change to user, role, permission, authentication, or access-control endpoints must update this file and be reviewed against `requirements.md`, `database.md`, and `architecture.md`.
