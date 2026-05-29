# Plan: Revisar y corregir `.gitignore` según estándares de Git

> Estado: **implementado**. Documento de planificación para alinear el `.gitignore` del
> repositorio SunStay con las convenciones estándar del stack.

## Contexto

El `.gitignore` raíz funciona en su mayoría (no hay artefactos de build ni `node_modules` trackeados,
`bun.lock` versionado, no existen lockfiles ajenos), pero tiene **una violación de estándar**, varias
omisiones para el stack (Bun + Next.js + NestJS + Prisma + Docker), y además versiona ~430 archivos de
tooling de skills (`.agents/` y `.claude/`) que no son código de la aplicación. El objetivo es alinearlo
con las convenciones estándar y dejar fuera del repo los archivos de desarrollo.

### Hallazgos

1. **Bug:** `.gitignore:31-32` ignora `apps/api/prisma/migrations/**/migration_lock.toml`. Prisma
   documenta que ese archivo **DEBE commitearse** (fija el provider de la base). Hay que quitar la regla.
2. **Tooling versionado:** `.agents/` (215 archivos) y `.claude/` (215 archivos, solo `skills/`) son copias
   espejo de paquetes de skills de Claude Code — tooling de desarrollo, no código de SunStay. Decisión:
   ignorarlas **y des-trackearlas**.

## Cambio 1 — Reescribir `.gitignore`

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
out/
.next/
next-env.d.ts
*.tsbuildinfo

# Test / coverage (NestJS + Jest)
coverage/
*.lcov
.nyc_output/

# Environment (.env.example SÍ se versiona)
.env
.env.local
.env.*.local

# Foreign package managers — el proyecto usa solo Bun (CLAUDE.md §3.1/§15)
package-lock.json
yarn.lock
pnpm-lock.yaml
pnpm-workspace.yaml

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
bun-debug.log*

# Prisma
# NOTA: migration_lock.toml y las migraciones SÍ se commitean (estándar Prisma).

# Docker — dumps/inicializaciones locales ad-hoc (la carpeta se conserva con .gitkeep)
docker/postgres/*.sql

# Agent / Claude Code tooling (skills locales, no son código de la app)
.agents/
.claude/
# Si más adelante se quiere compartir config de equipo, descomentar:
# !.claude/settings.json

# Deploy
.vercel/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
desktop.ini
$RECYCLE.BIN/

# Secrets / certs
*.pem

# Azure
azurite/
```

### Resumen de qué cambia y por qué

| Cambio | Motivo |
|---|---|
| **Quitar** `prisma/migrations/**/migration_lock.toml` | Estándar Prisma: debe versionarse (bug principal). |
| **Agregar** `.agents/` y `.claude/` | Tooling de skills, no código de la app. |
| **Agregar** `coverage/`, `*.lcov`, `.nyc_output/` | Salidas de tests (Jest de NestJS). |
| **Agregar** `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` | Refuerza la regla Bun-only de CLAUDE.md. |
| **Agregar** patrones de logs + `bun-debug.log*`, `.vercel/` | Estándar Node/Next. |
| **Agregar** `desktop.ini`, `$RECYCLE.BIN/`, `*.pem` | Entorno Windows del proyecto + higiene de secretos. |
| **Conservar** `next-env.d.ts`, `.next/`, `node_modules/`, `.env*`, `docker/postgres/*.sql` | Ya correctos. |

## Cambio 2 — Des-trackear lo que ya estaba versionado

Quitar reglas / agregar carpetas al `.gitignore` **no** afecta lo ya trackeado. Tras editar el archivo:

```bash
# Saca .agents y .claude del control de versiones (conserva los archivos en disco)
git rm -r --cached .agents .claude

# Trackea el migration_lock.toml que antes estaba ignorado
git add apps/api/prisma/migrations/migration_lock.toml
```

(Junto con `.gitignore` y la migración pendiente `20260529042657_init/` ya lista para commit.)

## Verificación

1. `git check-ignore -v apps/api/prisma/migrations/migration_lock.toml` → **sin salida** (ya no ignorado).
2. `git check-ignore -v .agents/x .claude/skills/x` → **ambos ignorados**.
3. `git status --short` → `.agents/` y `.claude/` aparecen como `D` (deleted del índice) y `migration_lock.toml` como nuevo.
4. `git ls-files .agents .claude | wc -l` → **0** (ya no trackeadas).
5. `ls .agents .claude` → siguen existiendo en disco (no se borraron).
6. `git ls-files | grep -E "node_modules/|\.next/|/dist/"` → vacío.
7. Confirmar que `.env.example` y `bun.lock` siguen trackeados.
