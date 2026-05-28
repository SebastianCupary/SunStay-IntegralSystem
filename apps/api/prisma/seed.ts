/**
 * SunStay - Database seed
 *
 * Seeds the initial catalog data described in docs/database.md section 11,
 * the system modules and role-module permission matrix from
 * docs/requirements.md section 10.2, and a default hotel.
 *
 * Run with: bun run prisma/seed.ts  (or: bun run prisma:seed)
 *
 * Idempotent: uses upsert on unique keys, so it can be run multiple times.
 */
// Must come first: loads the monorepo root .env into process.env (Prisma 7 and
// Bun do not auto-load it from this package's directory) so PrismaClient can
// read DATABASE_URL no matter the current working directory.
import './load-env';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// --- Catalog values (docs/database.md section 11) ---

const ROOM_STATUSES = ['Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance'];
const RESERVATION_STATUSES = ['Pending', 'Confirmed', 'Cancelled', 'Checked-in', 'Checked-out'];
const PAYMENT_STATUSES = ['Pending', 'Partial', 'Paid', 'Overdue'];
const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Card', 'QR Payment'];
const INVENTORY_AREAS = ['Breakfast', 'Pool', 'Room Supplies', 'Cleaning Products'];
const REPORT_TYPES = [
  'Reservation Report',
  'Guest Report',
  'Room Occupancy Report',
  'Billing Report',
  'Inventory Report',
  'Inventory Movement Report',
  'Staff Report',
  'Attendance Report',
  'Common Area Report',
  'Monthly Performance Report',
];

// Base roles (docs/database.md section 18.3)
const ROLES = ['Administrator', 'Receptionist', 'Inventory Manager', 'Management'];

// System modules (docs/database.md section 18.4)
const SYSTEM_MODULES = [
  { code: 'DASHBOARD', name: 'Dashboard', route: '/dashboard' },
  { code: 'RESERVATIONS', name: 'Reservations', route: '/reservations' },
  { code: 'GUESTS', name: 'Guests', route: '/guests' },
  { code: 'ROOMS', name: 'Rooms', route: '/rooms' },
  { code: 'BILLING', name: 'Billing', route: '/billing' },
  { code: 'INVENTORY', name: 'Inventory', route: '/inventory' },
  { code: 'STAFF', name: 'Staff', route: '/staff' },
  { code: 'ATTENDANCE', name: 'Attendance', route: '/attendance' },
  { code: 'COMMON_AREAS', name: 'Common Areas', route: '/common-areas' },
  { code: 'REPORTS', name: 'Reports', route: '/reports' },
  { code: 'USERS', name: 'Users', route: '/users' },
  { code: 'ROLES', name: 'Roles and Permissions', route: '/roles' },
];

// Permission presets -> [view, create, update, delete, export, manage]
type Flags = [boolean, boolean, boolean, boolean, boolean, boolean];
const FULL: Flags = [true, true, true, true, true, true];
const VIEW: Flags = [true, false, false, false, false, false];
const CREATE_UPDATE: Flags = [true, true, true, false, false, false];
const NONE: Flags = [false, false, false, false, false, false];

// Role-module permission matrix (docs/requirements.md section 10.2)
const PERMISSION_MATRIX: Record<string, Record<string, Flags>> = {
  Administrator: {
    DASHBOARD: FULL, RESERVATIONS: FULL, GUESTS: FULL, ROOMS: FULL, BILLING: FULL,
    INVENTORY: FULL, STAFF: FULL, ATTENDANCE: FULL, COMMON_AREAS: FULL, REPORTS: FULL,
    USERS: FULL, ROLES: FULL,
  },
  Receptionist: {
    DASHBOARD: VIEW, RESERVATIONS: FULL, GUESTS: FULL, ROOMS: FULL, BILLING: CREATE_UPDATE,
    INVENTORY: NONE, STAFF: NONE, ATTENDANCE: NONE, COMMON_AREAS: FULL, REPORTS: NONE,
    USERS: NONE, ROLES: NONE,
  },
  'Inventory Manager': {
    DASHBOARD: VIEW, RESERVATIONS: NONE, GUESTS: NONE, ROOMS: NONE, BILLING: NONE,
    INVENTORY: FULL, STAFF: NONE, ATTENDANCE: NONE, COMMON_AREAS: NONE, REPORTS: NONE,
    USERS: NONE, ROLES: NONE,
  },
  Management: {
    DASHBOARD: FULL, RESERVATIONS: VIEW, GUESTS: VIEW, ROOMS: VIEW, BILLING: VIEW,
    INVENTORY: VIEW, STAFF: VIEW, ATTENDANCE: VIEW, COMMON_AREAS: VIEW, REPORTS: FULL,
    USERS: NONE, ROLES: NONE,
  },
};

const HOTEL_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  console.log('Seeding SunStay catalogs...');

  // Default hotel
  await prisma.hotel.upsert({
    where: { id: HOTEL_ID },
    update: {},
    create: {
      id: HOTEL_ID,
      name: 'Hotel Tropical Sun',
      address: 'Trinidad, Beni, Bolivia',
    },
  });

  // Simple name-keyed catalogs
  for (const name of ROOM_STATUSES) {
    await prisma.roomStatus.upsert({ where: { name }, update: {}, create: { name } });
  }
  for (const name of RESERVATION_STATUSES) {
    await prisma.reservationStatus.upsert({ where: { name }, update: {}, create: { name } });
  }
  for (const name of PAYMENT_STATUSES) {
    await prisma.paymentStatus.upsert({ where: { name }, update: {}, create: { name } });
  }
  for (const name of PAYMENT_METHODS) {
    await prisma.paymentMethod.upsert({ where: { name }, update: {}, create: { name } });
  }
  for (const name of REPORT_TYPES) {
    await prisma.reportType.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Inventory areas (belong to the hotel; name is not globally unique, so guard manually)
  for (const name of INVENTORY_AREAS) {
    const existing = await prisma.inventoryArea.findFirst({ where: { hotelId: HOTEL_ID, name } });
    if (!existing) {
      await prisma.inventoryArea.create({ data: { hotelId: HOTEL_ID, name } });
    }
  }

  // Roles
  const roleByName: Record<string, string> = {};
  for (const name of ROLES) {
    const role = await prisma.role.upsert({
      where: { name },
      update: { isSystemRole: true },
      create: { name, isSystemRole: true },
    });
    roleByName[name] = role.id;
  }

  // System modules
  const moduleByCode: Record<string, string> = {};
  for (const m of SYSTEM_MODULES) {
    const mod = await prisma.systemModule.upsert({
      where: { code: m.code },
      update: { name: m.name, route: m.route },
      create: { code: m.code, name: m.name, route: m.route },
    });
    moduleByCode[m.code] = mod.id;
  }

  // Role-module permissions
  for (const [roleName, modules] of Object.entries(PERMISSION_MATRIX)) {
    const roleId = roleByName[roleName];
    for (const [code, flags] of Object.entries(modules)) {
      const systemModuleId = moduleByCode[code];
      const [canView, canCreate, canUpdate, canDelete, canExport, canManage] = flags;
      await prisma.roleModulePermission.upsert({
        where: { roleId_systemModuleId: { roleId, systemModuleId } },
        update: { canView, canCreate, canUpdate, canDelete, canExport, canManage },
        create: { roleId, systemModuleId, canView, canCreate, canUpdate, canDelete, canExport, canManage },
      });
    }
  }

  // Default administrator user.
  // Credentials are read from environment variables; sensible defaults are used
  // for local development only. Change them before any production deployment.
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@sunstay.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';
  const adminName = process.env.SEED_ADMIN_NAME ?? 'Administrador SunStay';
  // Bun.password.hash uses argon2id by default (Bun is the project runtime).
  const passwordHash = await Bun.password.hash(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { roleId: roleByName['Administrator'], status: 'Active' },
    create: {
      email: adminEmail,
      fullName: adminName,
      passwordHash,
      status: 'Active',
      roleId: roleByName['Administrator'],
    },
  });
  console.log(`Default admin user ensured: ${adminEmail}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log('  WARNING: using the default development password. Set SEED_ADMIN_PASSWORD for real environments.');
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
