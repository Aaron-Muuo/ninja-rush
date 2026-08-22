import React from 'react';

export default function Boss({ hp }) {
  return (
    <div className="w-[80px] h-[100px] relative animate-bounce">
      <div className="absolute bottom-0 w-[80px] h-[90px] bg-purple-900 rounded-xl border-4 border-purple-950">
        <div className="absolute top-4 w-full flex justify-center gap-4">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-3 bg-black rounded-full"></div>
        {/* HP Bar */}
        <div className="absolute -top-6 left-0 w-full h-2 bg-gray-800 rounded-full border border-gray-700">
          <div className="h-full bg-red-500 rounded-full" style={{ width: `${(hp / 5) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
}
