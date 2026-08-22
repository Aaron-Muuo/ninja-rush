import React from 'react';

export default function Enemy({ type }) {
  if (type === 'bat') {
    return (
      <div className="w-[40px] h-[50px] relative animate-bounce">
        <div className="absolute bottom-2 w-10 h-8 bg-gray-800 rounded-full border-2 border-gray-900">
          <div className="absolute -left-3 top-2 w-4 h-2 bg-gray-800 rounded-l-full transform -rotate-12"></div>
          <div className="absolute -right-3 top-2 w-4 h-2 bg-gray-800 rounded-r-full transform rotate-12"></div>
          <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className="w-[40px] h-[50px] relative">
        <div className="absolute bottom-0 w-8 h-12 bg-white rounded-md border-2 border-gray-400 left-1">
          <div className="absolute top-2 left-1 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute top-2 right-1 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute bottom-4 left-1 w-5 h-1 bg-black"></div>
        </div>
      </div>
    );
  }

  // default goblin
  return (
    <div className="w-[40px] h-[50px] relative">
      <div className="absolute bottom-0 w-10 h-10 bg-red-600 rounded-md border-2 border-red-800">
        <div className="absolute top-2 left-1 w-8 h-2 flex justify-between px-1">
          <div className="w-2 h-2 bg-yellow-300 rounded-full"><div className="w-1 h-1 bg-black rounded-full mt-0.5 ml-0.5"></div></div>
          <div className="w-2 h-2 bg-yellow-300 rounded-full"><div className="w-1 h-1 bg-black rounded-full mt-0.5 ml-0.5"></div></div>
        </div>
        <div className="absolute bottom-2 left-2 w-6 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
}
