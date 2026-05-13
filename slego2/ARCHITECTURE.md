# SLEGO 2 Architecture

## Overview

SLEGO 2 is a game originally written in the Second Life game in 2007. 
Players place colored pieces on a 5x5 board to form lines of 3+ matching colors over 40 rounds.
A competition list the best players.

## Project Structure

```
src/
├── client/          # Solid.js web app
├── server/          # Devvit backend
└── shared/          # Shared game logic
```

## Client Architecture

### Entry Point (`main.tsx`)

- Hybrid app supporting Solid.js + vanilla coexistence
- Global game context with reactive signals
- Progressive migration via feature flags

### State Management

- **Signal.tsx**: Simple wrapper around Solid.js signals
- **GameContext.tsx**: Global state (screen, results, game logic)
- **GameLogicService**: Business logic with observer pattern

### Components

```
pages/               # Screen components
├── MainMenuPage.tsx
├── GamePage.tsx
├── LevelsPage.tsx
└── HelpPage.tsx

components/          # Reusable UI
├── GameComponent.tsx
├── ResultPanel.tsx
└── TopBar.tsx
```

### Styles (`Styles.ts`)

- CSS-in-JS with global injection
- Component-specific styles via `addStyle()`
- Responsive design with media queries

## Shared Logic

### Core Types (`slego.ts`)

```typescript
export type Color = 'RED' | 'BLUE' | 'GREEN' | 'MAGENTA';
export interface Position { tx: number; ty: number; }
export interface Piece { center: Color; arms: {...} }
```

### Game Engine (`slego-game.ts`)

- **SlegoGame**: Main game orchestrator
- **Board**: Immutable board operations
- **40-round cycle** with piece placement and line clearing

### Data Flow

```
UI Interaction → GameContext → GameLogicService → SlegoGame → Board → UI Update
```

## Key Patterns

- **Reactive State**: Solid.js signals for UI updates
- **Immutable Operations**: All board changes return new instances
- **Observer Pattern**: GameLogicService notifies UI of changes
- **Feature Flags**: Progressive migration control

## Build & Dev

- **Vite**: Build tool with Solid.js plugin
- **TypeScript**: Strict type checking
- **pnpm run dev-client**: Development server
