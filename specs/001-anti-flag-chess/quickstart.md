# Quickstart: Anti-Flag Timed Chess

**Feature**: 001-anti-flag-chess
**Date**: 2025-12-09

## Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 8+ (`npm install -g pnpm`)
- Modern browser (Chrome, Firefox, Safari, Edge)

## Project Setup

### 1. Initialize Monorepo

```bash
# From repository root
pnpm init

# Create workspace configuration
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/*'
  - 'apps/*'
EOF

# Install Turborepo
pnpm add -D turbo

# Create turbo.json
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {}
  }
}
EOF
```

### 2. Create Core Package

```bash
mkdir -p packages/core/src/{game,timer,auto-move,types}
mkdir -p packages/core/tests/unit

cd packages/core
pnpm init

# Install dependencies
pnpm add chess.js
pnpm add -D typescript vitest @types/node
```

**packages/core/tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**packages/core/package.json** (key fields):
```json
{
  "name": "@anti-flag-chess/core",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

### 3. Create Web App

```bash
cd apps
pnpm create next-app web --typescript --tailwind --eslint --app --src-dir

cd web
pnpm add react-chessboard socket.io-client zustand @tanstack/react-query
pnpm add -D @anti-flag-chess/core
```

### 4. Create Server App

```bash
mkdir -p apps/server/src/{handlers,rooms,services}
mkdir -p apps/server/tests/{unit,integration}

cd apps/server
pnpm init

pnpm add socket.io express nanoid
pnpm add -D typescript vitest @types/node @types/express tsx
pnpm add -D @anti-flag-chess/core
```

**apps/server/tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"]
}
```

## Running Development

### Start All Services

```bash
# From repository root
pnpm dev
```

Or individually:

```bash
# Terminal 1: Core (watch mode)
cd packages/core && pnpm build --watch

# Terminal 2: Server
cd apps/server && pnpm dev

# Terminal 3: Web
cd apps/web && pnpm dev
```

### Default Ports

| Service | Port | URL |
|---------|------|-----|
| Web App | 3000 | http://localhost:3000 |
| WebSocket Server | 3001 | ws://localhost:3001 |

## Verification Steps

### 1. Core Package Works

```bash
cd packages/core
pnpm test
```

Expected: All unit tests pass (game state, timer logic, auto-move selection).

### 2. Server Starts

```bash
cd apps/server
pnpm dev
```

Expected: Console shows "WebSocket server listening on port 3001".

### 3. Web App Loads

```bash
cd apps/web
pnpm dev
```

Visit http://localhost:3000. Expected: Home page with "Create Game" button.

### 4. End-to-End Flow

1. Open http://localhost:3000 in Browser A
2. Click "Create Game", configure settings, create
3. Copy invite link
4. Open invite link in Browser B
5. Game should start automatically
6. Make moves, verify real-time sync
7. Let timer expire, verify grace period and auto-move

## Environment Variables

**apps/web/.env.local**:
```env
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**apps/server/.env**:
```env
PORT=3001
NODE_ENV=development
```

## Common Issues

### WebSocket Connection Failed
- Ensure server is running on port 3001
- Check CORS settings in server
- Verify `NEXT_PUBLIC_WS_URL` is correct

### Core Package Not Found
- Run `pnpm build` in packages/core
- Ensure workspace is linked: `pnpm install` from root

### Timer Drift
- This is expected in development with heavy CPU load
- Production uses server-authoritative timers
- Client interpolates between syncs

## Key Files to Implement

| File | Purpose |
|------|---------|
| `packages/core/src/game/GameState.ts` | Game state management |
| `packages/core/src/timer/TurnTimer.ts` | Timer logic |
| `packages/core/src/auto-move/selectMove.ts` | Random move selection |
| `apps/server/src/handlers/gameHandlers.ts` | WebSocket event handlers |
| `apps/server/src/services/GameService.ts` | Game orchestration |
| `apps/web/src/components/Board.tsx` | Chess board component |
| `apps/web/src/components/Timer.tsx` | Timer display |
| `apps/web/src/hooks/useGame.ts` | Game state hook |

## Next Steps

After quickstart verification:
1. Run `/speckit.tasks` to generate implementation tasks
2. Begin with Phase 1: Setup tasks
3. Follow task order respecting dependencies
