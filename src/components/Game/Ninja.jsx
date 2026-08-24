import React from 'react';
import { SKINS } from '../../utils/storage';

export default function Ninja({ skinId }) {
  const skin = SKINS.find(s => s.id === skinId) || SKINS[0];
  const color = skin.color;
  const accent = skin.accent;
  
  return (
    <div className="relative w-full h-full transition-transform">
      {/* Head/Mask */}
      <div className={`absolute top-0 w-8 h-8 ${color} rounded-full left-1 z-10 shadow-sm border-2 border-gray-900`}>
        {/* Eyes */}
        <div className="absolute top-2 right-1 w-5 h-2 bg-white rounded-sm flex justify-between px-0.5">
          <div className="w-1.5 h-1.5 bg-black rounded-full mt-0.5"></div>
          <div className="w-1.5 h-1.5 bg-black rounded-full mt-0.5"></div>
        </div>
        {/* Headband tail */}
        <div className={`headband absolute top-2 -left-3 w-4 h-1.5 ${accent} rounded-l -rotate-12`}></div>
      </div>
      
      {/* Back Arm (Left) */}
      <div className={`arm-l absolute top-8 w-2 h-5 ${color} left-3.5 rotate-12 rounded-full border border-gray-900 origin-top -z-10 brightness-75`}></div>

      {/* Back Leg (Left) */}
      <div className={`leg-l absolute top-13 w-2.5 h-5 ${color} left-3.5 rounded-full origin-top rotate-12 border border-gray-900 -z-10 brightness-75`}></div>

      {/* Body */}
      <div className={`absolute top-7 w-6 h-7 ${color} left-2 rounded-sm border-2 border-gray-900 z-0`}></div>
      
      {/* Scarf/Belt */}
      <div className={`absolute top-7 w-7 h-2 ${accent} left-1.5 rounded-sm z-10`}></div>
      
      {/* Front Arm (Right) */}
      <div className={`arm-r absolute top-8 w-2 h-5 ${color} left-3.5 -rotate-12 rounded-full border border-gray-900 origin-top z-10`}></div>
      
      {/* Front Leg (Right) */}
      <div className={`leg-r absolute top-13 w-2.5 h-5 ${color} left-3.5 rounded-full origin-top -rotate-12 border border-gray-900 z-10`}></div>
      
      {/* Sword on back or swinging */}
      <div className="sword-arm absolute top-2 w-1.5 h-14 bg-gray-300 left-3.5 origin-center -rotate-45 -z-10 border border-gray-500 rounded-sm transition-all duration-75">
         {/* Hilt */}
         <div className="absolute -top-2 -left-0.5 w-2.5 h-3 bg-yellow-600 border border-yellow-800"></div>
      </div>
    </div>
  );
}
