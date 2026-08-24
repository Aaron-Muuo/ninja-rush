import React, { useState, useEffect } from 'react';
import Game from './components/Game/Game';
import Ninja from './components/Game/Ninja';
import { loadGameData, saveGameData, calculateLevel, SKINS, MISSIONS } from './utils/storage';
import './index.css';

function App() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameover, shop, missions
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [justCompletedMissions, setJustCompletedMissions] = useState([]);
  
  const [gameData, setGameData] = useState(loadGameData());

  useEffect(() => {
    saveGameData(gameData);
  }, [gameData]);

  const handleResetProgress = () => {
    const freshData = {
      xp: 0,
      level: 1,
      coins: 0,
      highScore: 0,
      unlockedSkins: ['default'],
      currentSkin: 'default',
      completedMissions: []
    };
    setGameData(freshData);
    saveGameData(freshData);
  };

  const handleGameOver = (finalScore, runCoins) => {
    setScore(finalScore);
    setCoinsEarned(runCoins || 0);
    
    setGameData(prev => {
       const newXp = prev.xp + Math.floor(finalScore / 10);
       const newLevel = calculateLevel(newXp);
       let extraCoins = 0;
       const newlyCompleted = [];
       
       // Check missions
       MISSIONS.forEach(m => {
          if (!prev.completedMissions.includes(m.id)) {
             let completed = false;
             if (m.type === 'score' && finalScore >= m.target) completed = true;
             if (m.type === 'coins' && runCoins >= m.target) completed = true;
             if (m.type === 'level' && newLevel >= m.target) completed = true;
             
             if (completed) {
                newlyCompleted.push(m);
                extraCoins += m.reward;
             }
          }
       });
       
       setJustCompletedMissions(newlyCompleted);

       return {
         ...prev,
         xp: newXp,
         level: newLevel,
         coins: prev.coins + (runCoins || 0) + extraCoins,
         highScore: Math.max(prev.highScore || 0, finalScore),
         completedMissions: [...prev.completedMissions, ...newlyCompleted.map(m => m.id)]
       };
    });
    setGameState('gameover');
  };

  const buySkin = (skin) => {
    if (gameData.coins >= skin.cost && !gameData.unlockedSkins.includes(skin.id)) {
       setGameData(prev => ({
         ...prev,
         coins: prev.coins - skin.cost,
         unlockedSkins: [...prev.unlockedSkins, skin.id],
         currentSkin: skin.id
       }));
    }
  };

  const equipSkin = (skinId) => {
    if (gameData.unlockedSkins.includes(skinId)) {
       setGameData(prev => ({ ...prev, currentSkin: skinId }));
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white select-none overflow-hidden font-sans relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-40"
        style={{ backgroundImage: "url('/images/splash.png')", display: gameState === 'playing' ? 'none' : 'block' }}
      ></div>
      
      {/* Top HUD for Progression */}
      {gameState !== 'playing' && (
         <div className="absolute top-4 left-6 flex flex-col gap-1 z-20">
           <div className="text-xl font-bold text-white drop-shadow-md bg-black/50 px-4 py-2 border border-white/20">
             LEVEL {gameData.level} <span className="text-sm text-gray-400 ml-2">{gameData.xp} XP</span>
           </div>
           <div className="text-xl font-bold text-yellow-400 drop-shadow-md bg-black/50 px-4 py-2 border border-white/20">
             💰 {gameData.coins} COINS
           </div>
         </div>
      )}

      {gameState === 'menu' && (
        <>
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to completely wipe all your progress, coins, and skins? This cannot be undone.")) {
                handleResetProgress();
              }
            }}
            className="absolute top-4 left-4 z-50 px-3 py-1 bg-red-900/50 text-red-300 border border-red-500 rounded text-sm hover:bg-red-800 transition-colors cursor-pointer"
          >
            Reset Progress
          </button>
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
          
          <div className="flex gap-2 mb-6">
            <button 
              className="flex-1 px-4 py-3 bg-transparent border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-bold transition-all cursor-pointer text-sm"
              onClick={() => setGameState('shop')}
            >
              SKINS
            </button>
            <button 
              className="flex-1 px-4 py-3 bg-transparent border-2 border-blue-500 hover:bg-blue-500 hover:text-black text-blue-500 font-bold transition-all cursor-pointer text-sm"
              onClick={() => setGameState('missions')}
            >
              MISSIONS
            </button>
          </div>
          
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

      {gameState === 'shop' && (
        <div className="text-center w-full max-w-2xl bg-black/80 p-8 border-2 border-white backdrop-blur-md z-10 rounded-none h-[80vh] overflow-y-auto">
           <h2 className="text-5xl font-black text-white tracking-widest uppercase font-sans mb-6">SHOP</h2>
           
           <div className="grid grid-cols-2 gap-4 mb-8">
             {SKINS.map(skin => {
               const isUnlocked = gameData.unlockedSkins.includes(skin.id);
               const isEquipped = gameData.currentSkin === skin.id;
               return (
                 <div key={skin.id} className={`p-4 border-2 flex flex-col items-center ${isEquipped ? 'border-yellow-400 bg-yellow-900/30' : 'border-gray-600 bg-gray-800'}`}>
                   <div className="w-16 h-24 relative mb-4 flex items-center justify-center transform scale-[1.5]">
                      <div className="relative w-10 h-16">
                         <Ninja skinId={skin.id} />
                      </div>
                   </div>
                   <h3 className="text-xl font-bold mb-2">{skin.name}</h3>
                   {isEquipped ? (
                     <span className="text-yellow-400 font-bold px-4 py-2 border border-yellow-400">EQUIPPED</span>
                   ) : isUnlocked ? (
                     <button className="px-4 py-2 bg-white text-black font-bold hover:bg-gray-200 cursor-pointer w-full" onClick={() => equipSkin(skin.id)}>EQUIP</button>
                   ) : (
                     <button 
                       className={`px-4 py-2 font-bold w-full cursor-pointer ${gameData.coins >= skin.cost ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                       onClick={() => buySkin(skin)}
                     >
                       BUY ({skin.cost} 💰)
                     </button>
                   )}
                 </div>
               )
             })}
           </div>

           <button 
             className="w-full px-6 py-3 bg-transparent border-2 border-gray-500 hover:border-white text-gray-300 hover:text-white font-bold transition-all cursor-pointer mt-8"
             onClick={() => setGameState('menu')}
           >
             BACK TO MENU
           </button>
        </div>
      )}

      {gameState === 'missions' && (
        <div className="text-center w-full max-w-2xl bg-black/80 p-8 border-2 border-white backdrop-blur-md z-10 rounded-none h-[80vh] overflow-y-auto">
           <h2 className="text-5xl font-black text-white tracking-widest uppercase font-sans mb-6 text-blue-500">MISSIONS</h2>
           
           <div className="flex flex-col gap-4 mb-8">
             {MISSIONS.map(m => {
               const isCompleted = gameData.completedMissions.includes(m.id);
               return (
                 <div key={m.id} className={`p-4 border-2 flex items-center justify-between ${isCompleted ? 'border-green-500 bg-green-900/30' : 'border-gray-600 bg-gray-800'}`}>
                   <div className="text-left">
                      <h3 className="text-xl font-bold">{m.desc}</h3>
                      <p className="text-yellow-400 font-bold text-sm">Reward: {m.reward} 💰</p>
                   </div>
                   {isCompleted ? (
                     <span className="text-green-400 font-bold px-4 py-2 border border-green-500">COMPLETED</span>
                   ) : (
                     <span className="text-gray-400 font-bold px-4 py-2">IN PROGRESS</span>
                   )}
                 </div>
               )
             })}
           </div>

           <button 
             className="w-full px-6 py-3 bg-transparent border-2 border-gray-500 hover:border-white text-gray-300 hover:text-white font-bold transition-all cursor-pointer"
             onClick={() => setGameState('menu')}
           >
             BACK TO MENU
           </button>
        </div>
      )}

      {gameState === 'playing' && (
        <Game onGameOver={handleGameOver} currentSkinId={gameData.currentSkin} />
      )}

      {gameState === 'gameover' && (
        <div className="text-center w-full max-w-md bg-transparent p-8 border-2 border-white backdrop-blur-md z-10 rounded-none">
          <h2 className="text-6xl text-red-500 mb-2 mt-[-5px]" style={{ fontFamily: 'cursive' }}>
            Game Over
          </h2>
          <div className="bg-gray-900/80 rounded-none border border-gray-600 p-4 mb-4 mt-6">
            <p className="text-gray-300 text-sm mb-1 uppercase tracking-widest font-sans">Final Score</p>
            <p className="text-5xl font-black text-white">{score.toString().padStart(5, '0')}</p>
          </div>
          <div className="flex gap-4 mb-8">
            <div className="bg-gray-900/80 rounded-none border border-yellow-600 p-4 flex-1">
              <p className="text-yellow-500 text-xs mb-1 uppercase tracking-widest font-sans">Coins Collected</p>
              <p className="text-3xl font-black text-yellow-400">+{coinsEarned}</p>
            </div>
            <div className="bg-gray-900/80 rounded-none border border-blue-600 p-4 flex-1">
              <p className="text-blue-400 text-xs mb-1 uppercase tracking-widest font-sans">XP Gained</p>
              <p className="text-3xl font-black text-blue-300">+{Math.floor(score / 10)}</p>
            </div>
          </div>
          
          {justCompletedMissions.length > 0 && (
             <div className="bg-green-900/80 rounded-none border border-green-500 p-4 mb-8 mt-[-10px]">
                <p className="text-green-400 text-sm mb-2 uppercase tracking-widest font-sans font-bold">Missions Completed!</p>
                {justCompletedMissions.map(m => (
                   <div key={m.id} className="text-white text-sm">✓ {m.desc} <span className="text-yellow-400 ml-2">+{m.reward} 💰</span></div>
                ))}
             </div>
          )}
          
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
      )}
    </div>
  );
}

export default App;
