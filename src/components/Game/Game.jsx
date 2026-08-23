import React, { useEffect, useRef, useState } from 'react';
import Ninja from './Ninja';
import Obstacle from './Obstacle';
import Enemy from './Enemy';
import Coin from './Coin';
import PowerUp from './PowerUp';
import Boss from './Boss';
import { GAME_CONFIG } from '../../game/constants';
import { useKeyboard } from '../../hooks/useKeyboard';

export default function Game({ onGameOver, currentSkinId }) {
  const containerRef = useRef(null);
  const keys = useKeyboard();
  const requestRef = useRef();
  const lastTimeRef = useRef();
  
  // Game state
  const state = useRef({
    player: { x: 50, y: 0, velocityY: 0, isJumping: false, isDead: false, isAttacking: false, attackTimer: 0, hasShield: false, magnetTimer: 0, gliderTimer: 0 },
    entities: [], 
    clouds: [], 
    mountains: [],
    speed: GAME_CONFIG.initialSpeed,
    score: 0,
    coins: 0,
    combo: 1,
    timeOfDay: 0,
    timeSinceLastSpawn: 0,
    distance: 0,
    isPaused: false,
    currentBiome: 'forest',
    daysPassed: 0,
    nextBossDistance: 2000,
    bossActive: false,
    bossHp: 5,
    bossAttackTimer: 0,
    effects: []
  });

  const [uiState, setUiState] = useState({ score: 0, coins: 0, combo: 0, magnetTimer: 0, gliderTimer: 0, isPaused: false, biome: 'forest', bossActive: false, bossHp: 5 });

  const handleInput = () => {
    const st = state.current;
    if (st.player.isDead || st.isPaused) return;
    
    // Jump with Up Arrow
    const upActive = keys['ArrowUp'];
    const upJustPressed = upActive && !st.lastUpActive;
    st.lastUpActive = upActive;

    // Fast fall with Down Arrow
    if (keys['ArrowDown'] && st.player.isJumping) {
      st.player.velocityY = -GAME_CONFIG.jumpForce; // fast drop
    }

    // Attack with Spacebar
    const spaceActive = keys['Space'];
    const spaceJustPressed = spaceActive && !st.lastSpaceActive;
    st.lastSpaceActive = spaceActive;

    // Pause with Escape
    const escActive = keys['Escape'];
    const escJustPressed = escActive && !st.lastEscActive;
    st.lastEscActive = escActive;

    if (escJustPressed) {
      st.isPaused = !st.isPaused;
      setUiState(prev => ({ ...prev, isPaused: st.isPaused }));
      return;
    }

    if (upJustPressed && !st.player.isJumping) {
      st.player.velocityY = GAME_CONFIG.jumpForce;
      st.player.isJumping = true;
    }

    if (spaceJustPressed && !st.player.isAttacking && st.player.attackTimer <= 0) {
      triggerAttack();
    }
  };

  const triggerAttack = () => {
    const st = state.current;
    st.player.isAttacking = true;
    st.player.attackTimer = GAME_CONFIG.attackCooldown;
    
    // Check Boss Hit
    if (st.bossActive) {
      const canvasWidth = containerRef.current ? containerRef.current.clientWidth : window.innerWidth;
      const bossX = canvasWidth - 150;
      if (st.player.x + GAME_CONFIG.playerWidth + 200 > bossX) { // 200px reach for boss
         hitSomething = true;
         st.bossHp--;
         st.effects.push({ x: bossX, y: 100, timer: 0.3, text: 'BAM!' });
         st.score += 500;
         if (st.bossHp <= 0) {
            st.bossActive = false;
            st.nextBossDistance = st.distance + 2000;
            st.effects.push({ x: bossX, y: 100, timer: 1.0, text: 'BOSS DEFEATED!' });
            st.score += 5000;
            // Clear projectiles
            st.entities = st.entities.filter(e => e.type !== 'obstacle');
         }
      }
    }

    // Check if any enemy is in range
    let hitSomething = false;
    
    // Slash effect position relative to player
    st.effects.push({
      x: st.player.x + 40,
      y: st.player.y + 20,
      timer: 0.2 // duration of effect
    });

      for (let i = 0; i < st.entities.length; i++) {
        const ent = st.entities[i];
        if (ent.type.startsWith('enemy') && !ent.dead) {
          const dist = ent.x - (st.player.x + GAME_CONFIG.playerWidth);
          // If enemy is within attack range and roughly same height
          if (dist > -20 && dist < GAME_CONFIG.attackRange && Math.abs(st.player.y - ent.y) < 60) {
            ent.dead = true;
            hitSomething = true;
          st.combo += 1;
          st.score += 50 * st.combo;
          st.player.velocityY = Math.max(st.player.velocityY, 300); // small bounce
        }
      }
    }

    if (!hitSomething && st.player.isJumping) {
      // Missed attack in air might break combo or just do nothing. Let's just do nothing for now.
    }
  };

  const spawnEntity = (canvasWidth) => {
    const rand = Math.random();
    let type = 'obstacle';
    if (rand < 0.25) type = 'obstacle';
    else if (rand < 0.5) {
       const eRand = Math.random();
       if (eRand < 0.33) type = 'enemy-goblin';
       else if (eRand < 0.66) type = 'enemy-bat';
       else type = 'enemy-skeleton';
    } else if (rand < 0.9) type = 'coin'; // 40% chance of coins
    else {
      const pRand = Math.random();
      if (pRand < 0.33) type = 'powerup-shield';
      else if (pRand < 0.66) type = 'powerup-magnet';
      else type = 'powerup-glider';
    }
    
    // Spawn multiple if coin
    const count = type === 'coin' ? Math.floor(Math.random() * 4) + 2 : 1; 
    const baseHeight = type === 'coin' || type.startsWith('powerup') ? (Math.random() > 0.5 ? 120 : 0) : 0;
    
    for (let i = 0; i < count; i++) {
        let yPos = baseHeight;
        if (type === 'powerup-glider') yPos = 120; // Glider only in air
        if (type === 'enemy-bat') yPos = 120; // Bat flies
        
        let width = GAME_CONFIG.obstacleWidth;
        let height = GAME_CONFIG.obstacleHeight;
        if (type === 'coin') { width = GAME_CONFIG.coinSize; height = GAME_CONFIG.coinSize; }
        if (type.startsWith('powerup')) { width = GAME_CONFIG.powerUpSize; height = GAME_CONFIG.powerUpSize; }
        if (type.startsWith('enemy')) { width = 40; height = 50; }

        state.current.entities.push({
          id: Math.random().toString(36).substr(2, 9),
          type,
          x: canvasWidth + (i * 45), // spaced out
          y: yPos,
          width,
          height,
          dead: false,
          dodged: false
        });
    }
  };

  const checkCollision = (player, ent) => {
    if (ent.dead) return false;
    
    const pRect = {
      left: player.x,
      right: player.x + GAME_CONFIG.playerWidth,
      top: player.y + GAME_CONFIG.playerHeight,
      bottom: player.y
    };
    
    const eRect = {
      left: ent.x,
      right: ent.x + ent.width,
      top: ent.y + ent.height,
      bottom: ent.y
    };

    const overlapX = pRect.right > eRect.left + 10 && pRect.left < eRect.right - 10;
    const overlapY = pRect.top > eRect.bottom + 5 && pRect.bottom < eRect.top - 5;
    
    return overlapX && overlapY;
  };

  const gameLoop = (time) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = time;

    const st = state.current;
    
    if (!st.player.isDead && containerRef.current) {
      handleInput();
      
      if (st.isPaused) {
        requestRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const canvasWidth = containerRef.current.clientWidth;

      // Physics & Timers
      if (st.player.gliderTimer > 0) {
        st.player.gliderTimer -= dt;
        st.player.y = 120; // force hover in air
        st.player.velocityY = 0;
        st.player.isJumping = true; // animations might use this
      } else if (st.player.isJumping || st.player.y > 0) {
        st.player.velocityY -= GAME_CONFIG.gravity * dt;
        st.player.y += st.player.velocityY * dt;

        if (st.player.y <= 0) {
          st.player.y = 0;
          st.player.velocityY = 0;
          st.player.isJumping = false;
        }
      }
      
      if (st.player.attackTimer > 0) {
        st.player.attackTimer -= dt;
        if (st.player.attackTimer <= GAME_CONFIG.attackCooldown - 0.2) {
          st.player.isAttacking = false;
        }
      }
      
      if (st.player.magnetTimer > 0) st.player.magnetTimer -= dt;

      // Effects
      st.effects = st.effects.filter(e => {
        e.timer -= dt;
        return e.timer > 0;
      });

      // World Movement
      st.speed += GAME_CONFIG.speedIncreaseRate * dt;
      if (st.speed > GAME_CONFIG.maxSpeed) st.speed = GAME_CONFIG.maxSpeed;
      
      const moveDist = st.speed * dt;
      st.distance += moveDist;
      st.score += (moveDist / 10);
      
      const previousTime = st.timeOfDay;
      st.timeOfDay = (st.timeOfDay + dt) % 40;
      
      if (previousTime > 39 && st.timeOfDay < 1) {
         st.daysPassed = (st.daysPassed || 0) + 1;
      }
      
      const biomes = ['forest', 'village', 'volcano', 'city', 'mountain'];
      const biomeIndex = (st.daysPassed || 0) % biomes.length;
      st.currentBiome = biomes[biomeIndex];
      
      // Update UI state occasionally
      if (Math.floor(time / 100) % 2 === 0) {
        setUiState({ 
            score: Math.floor(st.score), 
            coins: st.coins, 
            combo: st.combo, 
            isPaused: st.isPaused,
            magnetTimer: Math.max(0, st.player.magnetTimer),
            gliderTimer: Math.max(0, st.player.gliderTimer),
            biome: st.currentBiome,
            bossActive: st.bossActive,
            bossHp: st.bossHp
        });
      }

      if (st.distance > st.nextBossDistance && !st.bossActive) {
         st.bossActive = true;
         st.bossHp = 5;
      }

      // Spawning
      st.timeSinceLastSpawn += dt;
      const spawnInterval = Math.max(0.8, 800 / st.speed) + Math.random();
      
      if (st.bossActive) {
         st.bossAttackTimer -= dt;
         if (st.bossAttackTimer <= 0) {
            st.bossAttackTimer = 1.5;
            st.entities.push({
               id: Math.random().toString(36).substr(2, 9),
               type: 'obstacle',
               x: canvasWidth - 100,
               y: Math.random() > 0.5 ? 60 : 0,
               width: GAME_CONFIG.obstacleWidth,
               height: GAME_CONFIG.obstacleHeight,
               dead: false,
               dodged: false
            });
            setUiState(prev => ({ ...prev, _tick: Date.now() }));
         }
      } else {
         if (st.timeSinceLastSpawn > spawnInterval) {
           spawnEntity(canvasWidth);
           st.timeSinceLastSpawn = 0;
           setUiState(prev => ({ ...prev, _tick: Date.now() }));
         }
      }
      
      // Procedural Backgrounds Spawning
      if (Math.random() < 0.02) {
         st.clouds.push({ id: Math.random().toString(36).substr(2, 9), x: canvasWidth, y: Math.random() * 200 + 50, speed: Math.random() * 20 + 10, width: Math.random() * 100 + 50 });
      }
      if (Math.random() < 0.01) {
         st.mountains.push({ id: Math.random().toString(36).substr(2, 9), x: canvasWidth, type: Math.random() > 0.5 ? 1 : 2 });
      }

      // Update Backgrounds
      st.clouds.forEach(c => c.x -= (c.speed + (st.speed * 0.1)) * dt);
      st.clouds = st.clouds.filter(c => c.x > -200);
      st.mountains.forEach(m => m.x -= (st.speed * 0.3) * dt); // Parallax effect
      st.mountains = st.mountains.filter(m => m.x > -400);

      // Update Entities & Collisions
      for (let i = st.entities.length - 1; i >= 0; i--) {
        const ent = st.entities[i];
        
        // Magnet effect
        if (st.player.magnetTimer > 0 && ent.type === 'coin' && !ent.dead) {
          const dx = st.player.x - ent.x;
          const dy = st.player.y - ent.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 300) {
            ent.x += dx * 5 * dt;
            ent.y += dy * 5 * dt;
          }
        }
        
        ent.x -= moveDist;

        // Perfect Dodge check
        if (!ent.dead && !ent.dodged && (ent.type === 'obstacle' || ent.type.startsWith('enemy')) && ent.x < st.player.x) {
          ent.dodged = true;
          // if we passed it and distance was very close (within 20px vertically)
          if (Math.abs(st.player.y - ent.height) < 20 || Math.abs((st.player.y + GAME_CONFIG.playerHeight) - ent.y) < 20) {
             // Perfect Dodge!
             st.combo += 2;
             st.score += 100 * st.combo;
             st.effects.push({ x: st.player.x, y: st.player.y + 30, timer: 0.5, text: 'PERFECT!' });
             // slow down game slightly for slow-mo effect
             st.speed = Math.max(GAME_CONFIG.initialSpeed, st.speed - 150);
          }
        }

        if (checkCollision(st.player, ent)) {
          if (ent.type === 'coin') {
            st.coins += 1;
            st.combo += 1;
            ent.dead = true;
            } else if (ent.type.startsWith('powerup')) {
              if (ent.type === 'powerup-shield') st.player.hasShield = true;
              if (ent.type === 'powerup-magnet') st.player.magnetTimer = 10; // 10 seconds
              if (ent.type === 'powerup-glider') st.player.gliderTimer = 5; // 5 seconds
              ent.dead = true;
            } else if (ent.type === 'obstacle' || ent.type.startsWith('enemy')) {
              if (st.player.hasShield) {
               st.player.hasShield = false;
               ent.dead = true;
               st.effects.push({ x: st.player.x, y: st.player.y + 30, timer: 0.5, text: 'SHIELD BROKEN' });
            } else {
               st.player.isDead = true;
               setTimeout(() => onGameOver(Math.floor(st.score), st.coins), 1500);
            }
          }
        }

        // Remove offscreen or collected
        if (ent.x < -100 || (ent.dead && (ent.type === 'coin' || ent.type.startsWith('powerup')))) {
          st.entities.splice(i, 1);
        }
      }
    }

    updateDOM();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const updateDOM = () => {
    if (!containerRef.current) return;
    
    const p = state.current.player;
    const st = state.current;
    
    // Day/Night Visuals
    const sky = document.getElementById('sky-background');
    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    const stars = document.getElementById('stars');
    
    if (sky && sun && moon && stars) {
      const isDay = st.timeOfDay < 20;
      const dayProgress = isDay ? (st.timeOfDay / 20) : 0;
      const nightProgress = !isDay ? ((st.timeOfDay - 20) / 20) : 0;
      
      const bColors = {
        forest: ['#87CEEB', '#E0F6FF'],
        village: ['#FFDAB9', '#FFE4B5'],
        volcano: ['#8B0000', '#FF4500'],
        city: ['#708090', '#B0C4DE'],
        mountain: ['#B0E0E6', '#F0F8FF']
      };
      const skyDay = bColors[st.currentBiome] || bColors.forest;
      
      const parallaxOffset = (st.distance * 0.05) % window.innerWidth;
      stars.style.backgroundPosition = `-${parallaxOffset}px 0`;
      
      if (isDay) {
        sky.style.background = `linear-gradient(to bottom, ${skyDay[0]}, ${skyDay[1]})`;
        sun.style.transform = `rotate(${dayProgress * 180}deg) translateX(calc(-40vw - ${parallaxOffset}px)) rotate(-${dayProgress * 180}deg)`;
        sun.style.opacity = dayProgress < 0.1 || dayProgress > 0.9 ? 0.5 : 1;
        moon.style.opacity = 0;
        stars.style.opacity = 0;
      } else {
        sky.style.background = `linear-gradient(to bottom, #0B1021, #1B2735)`;
        moon.style.transform = `rotate(${nightProgress * 180}deg) translateX(calc(-40vw - ${parallaxOffset}px)) rotate(-${nightProgress * 180}deg)`;
        moon.style.opacity = nightProgress < 0.1 || nightProgress > 0.9 ? 0.5 : 1;
        sun.style.opacity = 0;
        stars.style.opacity = 1;
      }
    }

    const playerEl = document.getElementById('player-ninja');
    if (playerEl) {
      playerEl.style.transform = `translate(${p.x}px, -${p.y}px)`;
      
      // Update weapon arm if attacking
      const sword = playerEl.querySelector('.sword-arm');
      if (sword) {
         if (p.isAttacking) {
             sword.style.transform = 'rotate(90deg)';
         } else {
             sword.style.transform = 'rotate(-45deg)';
         }
      }

      if (p.isDead) {
        playerEl.children[0].classList.add('rotate-90', 'origin-bottom-left');
      } else {
        playerEl.children[0].classList.remove('rotate-90', 'origin-bottom-left');
      }
      
      const legL = playerEl.querySelector('.leg-l');
      const legR = playerEl.querySelector('.leg-r');
      const headband = playerEl.querySelector('.headband');
      
      if (legL && legR) {
        if (p.isJumping) {
          legL.style.transform = 'rotate(-45deg)';
          legR.style.transform = 'rotate(12deg)';
          if (headband) headband.classList.remove('animate-pulse');
        } else {
          legL.style.transform = 'rotate(12deg)';
          legR.style.transform = 'rotate(-12deg)';
          if (headband) headband.classList.add('animate-pulse');
        }
      }
    }
    
    // Smooth scrolling updates bypass React render
    st.entities.forEach(ent => {
       const el = document.getElementById(`ent-${ent.id}`);
       if (el) {
          el.style.transform = `translate(${ent.x}px, -${ent.y}px)`;
          el.style.opacity = ent.dead ? 0.3 : 1;
       }
    });
    
    st.clouds.forEach(c => {
       const el = document.getElementById(`cloud-${c.id}`);
       if (el) el.style.transform = `translate(${c.x}px, ${c.y}px)`;
    });
    
    st.mountains.forEach(m => {
       const el = document.getElementById(`mtn-${m.id}`);
       if (el) el.style.transform = `translateX(${m.x}px)`;
    });
    
    const ground = document.getElementById('ground');
    if (ground) {
       ground.style.backgroundPositionX = `-${st.distance}px`;
    }
    
    const boss = document.getElementById('boss-container');
    if (boss) {
       boss.style.transform = `translateY(-${Math.sin(Date.now() / 300) * 20 + 20}px)`;
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    
    const handleTouch = (e) => {
      // Prevent default to stop zooming/scrolling on mobile
      if(e.type === 'touchstart') e.preventDefault();
      
      const st = state.current;
      if (st.player.isDead) return;
      
      if (!st.player.isJumping) {
        st.player.velocityY = GAME_CONFIG.jumpForce;
        st.player.isJumping = true;
      } else {
        if (!st.player.isAttacking && st.player.attackTimer <= 0) {
          triggerAttack();
        }
      }
    };
    
    const container = containerRef.current;
    if (container) {
       container.addEventListener('touchstart', handleTouch, { passive: false });
       container.addEventListener('mousedown', handleTouch);
    }

    return () => {
      cancelAnimationFrame(requestRef.current);
      if (container) {
        container.removeEventListener('touchstart', handleTouch);
        container.removeEventListener('mousedown', handleTouch);
      }
    };
  }, []);

  // Biome mapping
  const biomeColors = {
    forest: { skyDay: ['#87CEEB', '#E0F6FF'], ground: 'bg-green-800', border: 'border-green-700' },
    village: { skyDay: ['#FFDAB9', '#FFE4B5'], ground: 'bg-yellow-800', border: 'border-yellow-700' },
    volcano: { skyDay: ['#8B0000', '#FF4500'], ground: 'bg-red-950', border: 'border-red-900' },
    city: { skyDay: ['#708090', '#B0C4DE'], ground: 'bg-gray-800', border: 'border-gray-700' },
    mountain: { skyDay: ['#B0E0E6', '#F0F8FF'], ground: 'bg-slate-300', border: 'border-slate-400' }
  };
  const currentBiomeColors = biomeColors[uiState.biome] || biomeColors.forest;

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900" ref={containerRef}>
      {/* Background Skybox */}
      <div id="sky-background" className="absolute top-0 left-0 w-full h-full transition-colors duration-1000" style={{ background: `linear-gradient(to bottom, ${currentBiomeColors.skyDay[0]}, ${currentBiomeColors.skyDay[1]})` }}></div>
      
      {/* Stars Layer */}
      <div id="stars" className="absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-1000 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPgogIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPgogIDxjaXJjbGUgY3g9IjI1MCIgY3k9IjgwaCIgcj0iMSIgZmlsbD0id2hpdGUiLz4KICA8Y2lyY2xlIGN4PSIzNTAiIGN5PSIxNTAiIHI9IjEuNSIgZmlsbD0id2hpdGUiLz4KICA8Y2lyY2xlIGN4PSI4MCIgY3k9IjE4MCIgcj0iMSIgZmlsbD0id2hpdGUiLz4KICA8Y2lyY2xlIGN4PSIyMjAiIGN5PSIyMjAiIHI9IjIiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==')]"></div>

      {/* Celestial Bodies */}
      <div className="absolute w-full flex justify-center" style={{ bottom: '0px' }}>
        <div id="sun" className="absolute w-24 h-24 bg-yellow-300 rounded-full shadow-[0_0_50px_rgba(253,224,71,0.8)] transition-opacity" style={{ bottom: '-12vw', opacity: 0 }}></div>
        <div id="moon" className="absolute w-20 h-20 bg-gray-200 rounded-full shadow-[0_0_30px_rgba(229,231,235,0.6)] transition-opacity" style={{ bottom: '-10vw', opacity: 0 }}>
          <div className="absolute top-3 right-4 w-6 h-6 bg-gray-300 rounded-full opacity-40"></div>
          <div className="absolute bottom-6 left-3 w-4 h-4 bg-gray-300 rounded-full opacity-40"></div>
        </div>
      </div>
      
      {/* Procedural Clouds */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-100 z-0">
        {state.current.clouds.map((c) => (
           <div id={`cloud-${c.id}`} key={`cloud-${c.id}`} className="absolute bg-white rounded-full opacity-90 shadow-lg blur-sm" style={{ left: 0, top: 0, width: `${c.width}px`, height: `${c.width/3}px`, transform: `translate(${c.x}px, ${c.y}px)` }}></div>
        ))}
      </div>
      
      {/* Procedural Mountains */}
      <div className="absolute w-full h-full pointer-events-none" style={{ bottom: `${GAME_CONFIG.groundHeight}px` }}>
        {state.current.mountains.map((m) => (
           <div id={`mtn-${m.id}`} key={`mtn-${m.id}`} className="absolute bottom-0 border-b-[150px] border-l-[100px] border-r-[100px] border-l-transparent border-r-transparent opacity-40" style={{ left: 0, transform: `translateX(${m.x}px)`, borderBottomColor: m.type === 1 ? '#475569' : '#334155' }}></div>
        ))}
      </div>
      
      {/* HUD */}
      <div className="absolute top-4 left-6 flex flex-col gap-2 z-50">
        <div className="text-2xl font-bold font-mono text-white drop-shadow-md">
          SCORE {uiState.score.toString().padStart(5, '0')}
        </div>
        <div className="text-xl font-bold font-mono text-yellow-400 drop-shadow-md">
          🪙 {uiState.coins}
        </div>
        {/* Power-up Timers */}
        {uiState.magnetTimer > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xl">🧲</span>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
              <div className="h-full bg-purple-500" style={{ width: `${(uiState.magnetTimer / 10) * 100}%` }}></div>
            </div>
          </div>
        )}
        {uiState.gliderTimer > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xl">🪁</span>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
              <div className="h-full bg-emerald-500" style={{ width: `${(uiState.gliderTimer / 5) * 100}%` }}></div>
            </div>
          </div>
        )}
      </div>
      
      {uiState.combo > 1 && (
        <div className="absolute top-10 right-10 text-4xl font-black italic text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] z-50 animate-bounce">
          COMBO x{uiState.combo}!
        </div>
      )}
      
      {/* Pause Menu */}
      {uiState.isPaused && !state.current.player.isDead && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-5xl font-black text-cyan-400 mb-4 tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">PAUSED</h2>
            <p className="text-gray-300">Press ESC to Resume</p>
          </div>
        </div>
      )}
      
      {/* Ground */}
      <div 
        id="ground"
        className={`absolute bottom-0 left-0 w-full border-t-4 transition-colors duration-1000 ${currentBiomeColors.ground} ${currentBiomeColors.border}`}
        style={{ 
          height: `${GAME_CONFIG.groundHeight}px`,
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.1) 40px, rgba(0,0,0,0.1) 80px)`,
          backgroundPositionX: '0px'
        }}
      >
        <div className="w-full h-2 bg-black opacity-30 mt-2"></div>
      </div>

      {/* Game World layer */}
      <div 
        className="absolute w-full left-0"
        style={{ bottom: `${GAME_CONFIG.groundHeight}px`, height: 0 }}
      >
        {/* Player */}
        <div id="player-ninja" className="absolute bottom-0 left-0 transition-transform duration-75" style={{width: '40px', height: '60px', transform: 'translate(50px, 0px)'}}>
          <Ninja skinId={currentSkinId} />
        </div>

        {/* Entities */}
        {state.current.entities.map(ent => (
          <div id={`ent-${ent.id}`} key={ent.id} className="absolute bottom-0 left-0" style={{transform: `translate(${ent.x}px, -${ent.y}px)`, opacity: ent.dead ? 0.3 : 1}}>
             {ent.type === 'obstacle' && <Obstacle />}
             {ent.type.startsWith('enemy') && <Enemy type={ent.type.split('-')[1]} />}
             {ent.type === 'coin' && <Coin />}
             {ent.type.startsWith('powerup') && <PowerUp type={ent.type.split('-')[1]} />}
          </div>
        ))}

        {/* Boss */}
        {uiState.bossActive && (
           <div id="boss-container" className="absolute bottom-0" style={{ right: '50px' }}>
              <Boss hp={uiState.bossHp} />
           </div>
        )}
        
        {/* Slash and Text Effects */}
        {state.current.effects.map((eff, i) => (
           eff.text ? (
             <div key={`eff-${i}`} className="absolute font-black italic text-cyan-300 drop-shadow-md text-xl animate-bounce" style={{bottom: `${eff.y}px`, left: `${eff.x}px`}}>{eff.text}</div>
           ) : (
             <div key={`eff-${i}`} className="absolute w-12 h-2 bg-white rounded-full shadow-[0_0_10px_white]" style={{bottom: `${eff.y}px`, left: `${eff.x}px`, transform: 'rotate(-20deg)', opacity: eff.timer / 0.2}}></div>
           )
        ))}
      </div>
      
      {/* Player active power-up visual indicators */}
      {state.current.player.hasShield && (
        <div id="shield-effect" className="absolute border-4 border-blue-400 rounded-full w-[60px] h-[80px] shadow-[0_0_15px_rgba(96,165,250,0.8)] opacity-70 transition-transform duration-75" style={{bottom: `${GAME_CONFIG.groundHeight - 10}px`, left: '40px', transform: `translateY(-${state.current.player.y}px)`}}></div>
      )}
      
      {state.current.player.isDead && (
        <div className="absolute inset-0 bg-red-900/30 z-40"></div>
      )}
    </div>
  );
}
