import React, { useEffect, useRef, useState } from 'react';
import Ninja from './Ninja';
import Obstacle from './Obstacle';
import { GAME_CONFIG } from '../../game/constants';
import { useKeyboard } from '../../hooks/useKeyboard';

export default function Game({ onGameOver }) {
  const containerRef = useRef(null);
  const keys = useKeyboard();
  const requestRef = useRef();
  const lastTimeRef = useRef();
  
  // Game state (refs for performance in the animation loop)
  const state = useRef({
    player: { x: 50, y: 0, velocityY: 0, isJumping: false, isDead: false },
    obstacles: [],
    speed: GAME_CONFIG.initialSpeed,
    score: 0,
    distance: 0,
    timeSinceLastObstacle: 0,
  });

  // UI state for score display
  const [scoreDisplay, setScoreDisplay] = useState(0);

  // Handle Input (jump)
  const handleInput = () => {
    if (state.current.player.isDead) return;
    
    // Jump if on ground and space/click/touch
    if ((keys['Space'] || keys['ArrowUp']) && !state.current.player.isJumping) {
      state.current.player.velocityY = GAME_CONFIG.jumpForce;
      state.current.player.isJumping = true;
    }
  };

  const spawnObstacle = (canvasWidth) => {
    state.current.obstacles.push({
      x: canvasWidth,
      type: 'rock',
      width: GAME_CONFIG.obstacleWidth,
      height: GAME_CONFIG.obstacleHeight,
      passed: false
    });
  };

  const checkCollision = (player, obstacle) => {
    const pRect = {
      left: player.x,
      right: player.x + GAME_CONFIG.playerWidth,
      top: -player.y + GAME_CONFIG.playerHeight,
      bottom: -player.y
    };
    
    // Convert obstacle logic (it sits on ground)
    const oRect = {
      left: obstacle.x,
      right: obstacle.x + obstacle.width,
      top: obstacle.height,
      bottom: 0
    };

    // AABB Collision (simplified for y since player top/bottom are relative to ground)
    // player.y is distance from ground. 
    // Player hits if: player.x overlaps obstacle.x AND player.y < obstacle.height
    
    const overlapX = pRect.right > oRect.left + 10 && pRect.left < oRect.right - 10; // slightly forgiving hitboxes
    const overlapY = player.y < obstacle.height - 10;
    
    return overlapX && overlapY;
  };

  const gameLoop = (time) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
    }
    
    // Delta time in seconds
    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    if (!state.current.player.isDead && containerRef.current) {
      handleInput();
      
      const dt = Math.min(deltaTime, 0.1); // cap dt to prevent huge jumps on lag
      const st = state.current;
      const canvasWidth = containerRef.current.clientWidth;

      // Physics
      if (st.player.isJumping || st.player.y > 0) {
        st.player.velocityY -= GAME_CONFIG.gravity * dt;
        st.player.y += st.player.velocityY * dt;

        if (st.player.y <= 0) {
          st.player.y = 0;
          st.player.velocityY = 0;
          st.player.isJumping = false;
        }
      }

      // World Movement & Speed increase
      st.speed += GAME_CONFIG.speedIncreaseRate * dt;
      if (st.speed > GAME_CONFIG.maxSpeed) st.speed = GAME_CONFIG.maxSpeed;
      
      const moveDist = st.speed * dt;
      st.distance += moveDist;
      st.score = Math.floor(st.distance / 10);
      
      // Update score UI ~10 times a sec rather than every frame
      if (Math.floor(time / 100) % 2 === 0) {
        setScoreDisplay(st.score);
      }

      // Spawning
      st.timeSinceLastObstacle += dt;
      // Spawn interval based on speed
      const spawnInterval = Math.max(1.0, 800 / st.speed) + Math.random() * 1.5;
      
      if (st.timeSinceLastObstacle > spawnInterval) {
        spawnObstacle(canvasWidth);
        st.timeSinceLastObstacle = 0;
      }

      // Update Obstacles & Check Collisions
      for (let i = st.obstacles.length - 1; i >= 0; i--) {
        const obs = st.obstacles[i];
        obs.x -= moveDist;

        if (checkCollision(st.player, obs)) {
          st.player.isDead = true;
          setTimeout(() => onGameOver(st.score), 1500);
        }

        // Remove offscreen
        if (obs.x < -100) {
          st.obstacles.splice(i, 1);
        }
      }
    }

    // Force re-render of just the canvas elements by updating dom nodes directly
    // This is faster than React state for 60fps
    updateDOM();

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const updateDOM = () => {
    if (!containerRef.current) return;
    
    const p = state.current.player;
    const playerEl = document.getElementById('player-ninja');
    if (playerEl) {
      playerEl.style.transform = `translate(${p.x}px, -${p.y}px)`;
      if (p.isDead) {
        playerEl.children[0].classList.add('rotate-90', 'origin-bottom-left');
      } else {
        playerEl.children[0].classList.remove('rotate-90', 'origin-bottom-left');
      }
      
      // Basic jump animation via classes
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

    // Update obstacles
    state.current.obstacles.forEach((obs, index) => {
      const el = document.getElementById(`obstacle-${index}`);
      if (el) {
        el.style.transform = `translate(${obs.x}px, 0px)`;
      }
    });
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    
    // Add touch support
    const handleTouch = () => {
      if (!state.current.player.isDead && !state.current.player.isJumping) {
        state.current.player.velocityY = GAME_CONFIG.jumpForce;
        state.current.player.isJumping = true;
      }
    };
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('mousedown', handleTouch);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('mousedown', handleTouch);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900" ref={containerRef}>
      {/* Background (Parallax placeholder) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900 to-gray-900"></div>
      
      {/* HUD */}
      <div className="absolute top-4 left-6 text-2xl font-bold font-mono text-white drop-shadow-md z-50">
        SCORE {scoreDisplay.toString().padStart(5, '0')}
      </div>
      
      {/* Ground */}
      <div 
        className="absolute bottom-0 left-0 w-full bg-gray-800 border-t-4 border-gray-700"
        style={{ height: `${GAME_CONFIG.groundHeight}px` }}
      >
        {/* Ground details */}
        <div className="w-full h-2 bg-gray-900 opacity-30 mt-2"></div>
      </div>

      {/* Game World layer - anchored to ground */}
      <div 
        className="absolute w-full left-0"
        style={{ bottom: `${GAME_CONFIG.groundHeight}px`, height: 0 }}
      >
        {/* Player Container */}
        <div id="player-ninja" className="absolute bottom-0 left-0 transition-transform duration-75" style={{width: '40px', height: '60px', transform: 'translate(50px, 0px)'}}>
          <Ninja x={0} y={0} isJumping={false} isDead={false} />
        </div>

        {/* Obstacles Container */}
        {state.current.obstacles.map((obs, i) => (
          <div key={`obs-react-${i}`} id={`obstacle-${i}`} className="absolute bottom-0 left-0">
             <Obstacle x={0} type={obs.type} />
          </div>
        ))}
      </div>
      
      {state.current.player.isDead && (
        <div className="absolute inset-0 bg-red-900/30 z-40"></div>
      )}
    </div>
  );
}
