import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="relative">
        {/* Outer ring with subtle gradient */}
        <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-white border-r-white opacity-40 animate-spin"></div>
        
        {/* Inner ring with opposite animation */}
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-white border-l-white opacity-50 animate-[spin_1.5s_linear_infinite_reverse]"></div>
        
        {/* Center dot with subtle pulse */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;