# Ninja Rush - Documentation

This document contains architectural decisions and documentation for the Ninja Rush project.

## Architecture Overview
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **Game Loop**: `requestAnimationFrame` for handling physics, drawing, and logic without relying on heavy React state updates for 60fps components.
- **State Management**: React state for UI (menus, scores, HUD), and mutable refs / plain JS objects for the core game loop to ensure performance.
- **Data Persistence**: LocalStorage for scores, unlockables, and settings.

## Game Structure
- `src/components/`: React components for UI, HUD, Menus, and the React-based Game wrapper.
- `src/game/`: Core game logic containing physics, collision, and the game loop.
- `src/utils/`: Utility functions (random numbers, LocalStorage wrapper, etc.).
- `src/hooks/`: Custom hooks like `useGameLoop` and `useKeyboard`.

## Development Phases
- **Phase 1: Playable MVP (Completed)**
  - Implemented `Game.jsx` with a custom `requestAnimationFrame` loop that operates outside React's render cycle for performance.
  - Implemented `Ninja.jsx` using purely Tailwind CSS shapes.
  - Collision detection uses AABB (Axis-Aligned Bounding Box) logic adapted for a side-scrolling perspective.
  - Integrated a dynamic speed multiplier to make the game harder as the score increases.
- **Phase 2**: Core Gameplay (In Progress - Combat, combo, dodge, power-ups)
- **Phase 3**: Content (Biomes, day/night dynamic skybox with sun/moon, random procedural clouds and interactive scrolling terrain, enemies, bosses)
- **Phase 4**: Progression (Levels, unlocks, missions)
- **Phase 5**: Polish (Particles, sound, performance, Muuo Creatives branding badge)
