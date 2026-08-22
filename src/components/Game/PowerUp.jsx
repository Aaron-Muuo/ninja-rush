import React from 'react';

export default function PowerUp({ type }) {
  const isShield = type === 'shield';
  const isGlider = type === 'glider';
  
  let bgClass = 'bg-purple-500 border-purple-300';
  let icon = '🧲';
  
  if (isShield) {
    bgClass = 'bg-blue-500 border-blue-300';
    icon = '🛡️';
  } else if (isGlider) {
    bgClass = 'bg-emerald-500 border-emerald-300';
    icon = '🪁';
  }

  return (
    <div className={`w-[35px] h-[35px] relative rounded-lg border-2 flex items-center justify-center animate-pulse ${bgClass}`}>
      <span className="text-white font-bold text-sm">{icon}</span>
    </div>
  );
}
