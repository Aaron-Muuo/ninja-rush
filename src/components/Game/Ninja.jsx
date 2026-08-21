import React from 'react';

export default function Ninja() {
  return (
    <div className="relative w-full h-full transition-transform">
      {/* Head/Mask */}
      <div className="absolute top-0 w-8 h-8 bg-gray-800 rounded-full left-1 z-10 shadow-sm border-2 border-gray-900">
        {/* Eyes */}
        <div className="absolute top-2 right-1 w-5 h-2 bg-white rounded-sm flex justify-between px-0.5">
          <div className="w-1.5 h-1.5 bg-black rounded-full mt-0.5"></div>
          <div className="w-1.5 h-1.5 bg-black rounded-full mt-0.5"></div>
        </div>
        {/* Headband tail */}
        <div className="headband absolute top-2 -left-3 w-4 h-1.5 bg-red-600 rounded-l animate-pulse -rotate-12"></div>
      </div>
      
      {/* Body */}
      <div className="absolute top-7 w-6 h-7 bg-gray-800 left-2 rounded-sm border-2 border-gray-900 z-0"></div>
      
      {/* Scarf/Belt */}
      <div className="absolute top-7 w-7 h-2 bg-red-600 left-1.5 rounded-sm z-10"></div>
      
      {/* Arms */}
      <div className="absolute top-8 w-2 h-5 bg-gray-700 left-1 rotate-12 rounded-full"></div>
      <div className="absolute top-8 w-2 h-5 bg-gray-700 left-7 -rotate-12 rounded-full"></div>
      
      {/* Legs */}
      <div className="leg-l absolute top-13 w-2.5 h-5 bg-gray-800 left-2 rounded-full origin-top rotate-12"></div>
      <div className="leg-r absolute top-13 w-2.5 h-5 bg-gray-800 left-5.5 rounded-full origin-top -rotate-12"></div>
      
      {/* Sword on back */}
      <div className="absolute top-1 w-1.5 h-10 bg-gray-300 left-0 -rotate-45 z-0 border border-gray-500 rounded-sm"></div>
    </div>
  );
}
