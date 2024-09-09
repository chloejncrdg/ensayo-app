import React from 'react';

const Skeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col animate-pulse w-full">
      <div className="h-48 bg-gray-300">
        <div className="w-full h-full"></div>
      </div>
      <div className="flex-grow p-4 space-y-4">
        <div className="w-full h-6 bg-gray-300 rounded"></div>
        <div className="w-full h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default Skeleton;
