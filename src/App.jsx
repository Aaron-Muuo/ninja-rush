import React, { useState } from 'react';
import Game from './components/Game/Game';
import './index.css';

function App() {
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);

  const handleGameOver = (finalScore) => {
    setScore(finalScore);
    setGameState('gameover');
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white select-none overflow-hidden font-sans relative">
      {gameState === 'menu' && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-40"
            style={{ backgroundImage: "url('/images/splash.png')" }}
          ></div>
          <div className="text-center w-full max-w-md bg-transparent p-8 border-2 border-white backdrop-blur-md z-10 rounded-none">
          <div className="mb-8">
            <h1 className="text-7xl font-black text-white tracking-widest uppercase font-sans">
              NINJA
            </h1>
            <h2 className="text-6xl text-red-500 mt-[-5px]" style={{ fontFamily: 'cursive' }}>
              Rush
            </h2>
          </div>
          
          <button 
            className="animated-border-btn w-full mb-4 px-8 py-4 text-2xl font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
            onClick={() => setGameState('playing')}
          >
            PLAY
          </button>
          
          <p className="text-gray-300 mt-6 text-sm mb-4">
            Press UP to Jump | DOWN to Drop | SPACE to Attack
          </p>
          
          <a 
            href="https://muuocreatives.co.ke" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-4 px-4 py-2 bg-transparent border-2 border-gray-500 text-xs text-gray-400 hover:text-white hover:border-white transition-colors cursor-pointer"
          >
            Crafted by <span className="text-white font-bold">Muuo Creatives</span>
          </a>
        </div>
        </>
      )}

      {gameState === 'playing' && (
        <Game onGameOver={handleGameOver} />
      )}

      {gameState === 'gameover' && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-40"
            style={{ backgroundImage: "url('/images/splash.png')" }}
          ></div>
          <div className="text-center w-full max-w-md bg-transparent p-8 border-2 border-white backdrop-blur-md z-10 rounded-none">
            <h2 className="text-6xl text-red-500 mb-2 mt-[-5px]" style={{ fontFamily: 'cursive' }}>
              Game Over
            </h2>
            <div className="bg-gray-900/80 rounded-none border border-gray-600 p-4 mb-8 mt-6">
              <p className="text-gray-300 text-sm mb-1 uppercase tracking-widest font-sans">Final Score</p>
              <p className="text-5xl font-black text-white">{score.toString().padStart(5, '0')}</p>
            </div>
            
            <button 
              className="animated-border-btn w-full mb-4 px-8 py-4 text-2xl font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
              onClick={() => setGameState('playing')}
            >
              PLAY AGAIN
            </button>
            <button 
              className="w-full px-6 py-3 bg-transparent border-2 border-gray-500 hover:border-white text-gray-300 hover:text-white font-bold transition-all cursor-pointer"
              onClick={() => setGameState('menu')}
            >
              MAIN MENU
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
