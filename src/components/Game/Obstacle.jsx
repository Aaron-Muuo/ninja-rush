import React from 'react';

export default function Obstacle() {
  return (
    <div className="w-[40px] h-[50px] relative">
      {/* Simple Rock design for MVP */}
      <div className="absolute bottom-0 w-10 h-10 bg-gray-600 rounded-t-lg border-2 border-gray-700"></div>
      <div className="absolute bottom-0 left-1 w-5 h-12 bg-gray-500 rounded-t-md border-2 border-gray-700"></div>
    </div>
  );
}
