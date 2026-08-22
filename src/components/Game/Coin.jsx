import React from 'react';

export default function Coin() {
  return (
    <div className="w-[30px] h-[30px] relative animate-spin-slow">
      <div className="absolute inset-0 bg-yellow-400 rounded-full border-4 border-yellow-600 shadow-[0_0_10px_rgba(250,204,21,0.8)] flex items-center justify-center">
        <div className="w-3 h-4 border-2 border-yellow-600 rounded-sm"></div>
      </div>
    </div>
  );
}
