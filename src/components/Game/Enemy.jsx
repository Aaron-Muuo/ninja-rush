import React from 'react';

export default function Enemy({ type }) {
  // Simple CSS Enemy for MVP
  // Types could be: snake, goblin, bird
  return (
    <div className="w-[40px] h-[50px] relative">
      <div className="absolute bottom-0 w-10 h-10 bg-red-600 rounded-md border-2 border-red-800">
        {/* Evil eyes */}
        <div className="absolute top-2 left-1 w-8 h-2 flex justify-between px-1">
          <div className="w-2 h-2 bg-yellow-300 rounded-full">
             <div className="w-1 h-1 bg-black rounded-full mt-0.5 ml-0.5"></div>
          </div>
          <div className="w-2 h-2 bg-yellow-300 rounded-full">
             <div className="w-1 h-1 bg-black rounded-full mt-0.5 ml-0.5"></div>
          </div>
        </div>
        {/* Mouth */}
        <div className="absolute bottom-2 left-2 w-6 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
}
