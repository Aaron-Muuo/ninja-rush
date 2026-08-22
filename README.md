# Ninja Rush 🥷

Ninja Rush is a fast-paced, highly polished 2D endless-runner/action game. Inspired by the simplicity of the classic Chrome Dino game, Ninja Rush introduces deeper combat, combo mechanics, enemies, power-ups, progression systems, and unlockable content. The game is designed to be highly responsive, featuring a one-button contextual control system ("Easy to learn, difficult to master").

## Tech Stack

- **React.js**: Used for UI components (Menus, HUD, Modals, State management).
- **Tailwind CSS (v4)**: For rapid, clean, and responsive UI/UX styling. The Ninja character and game objects are rendered dynamically using Tailwind CSS!
- **Vite**: Superfast frontend tooling and building.
- **JavaScript (ES6+)**: Core game logic and architecture.
- **HTML Canvas / DOM**: The game avoids a heavy canvas engine, opting for a highly optimized `requestAnimationFrame` loop that directly manipulates DOM refs for smooth 60fps physics, decoupled from React's render cycles.
- **LocalStorage**: Used for persisting player progression (coins, levels, unlocks, high scores) without needing a backend database.

## Core Features

- **Contextual One-Button Gameplay**: Space/Click/Tap does everything—jump, double jump, wall jump, and attack!
- **Endless Procedural World**: Gradually increasing difficulty and speed with multiple generated obstacle and enemy patterns.
- **Combo & Perfect Dodge System**: Reward risky plays with slow-motion effects, score multipliers, and temporary invincibility.
- **Progression**: Earn coins to unlock new skins, environments, and power-ups.
- **Responsive**: Fully playable on desktop, tablet, and mobile devices.

## How to Play

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.
4. Open the provided `localhost` URL in your browser.
5. Hit **SPACE** or **Click/Tap** the screen to jump and dodge obstacles!

## Roadmap (Development Phases)

- **Phase 1**: Playable MVP (Movement, single obstacle, score, game over) ✅
- **Phase 2**: Core Gameplay (Combat, combo, dodge, power-ups) ⏳
- **Phase 3**: Content (Biomes, enemies, bosses, day/night cycle, dynamic clouds & terrain)
- **Phase 4**: Progression (Levels, unlocks, missions)
- **Phase 5**: Polish (Particles, sound, performance, Muuo Creatives branding)
