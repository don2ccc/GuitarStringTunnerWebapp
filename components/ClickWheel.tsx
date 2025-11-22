import React from 'react';

interface ClickWheelProps {
  onNext: () => void;
  onPrev: () => void;
  onMenu: () => void;
  onPlayPause: () => void;
  onSelect: () => void;
  isPlaying: boolean;
}

export const ClickWheel: React.FC<ClickWheelProps> = ({ 
  onNext, 
  onPrev, 
  onMenu, 
  onPlayPause,
  onSelect,
  isPlaying
}) => {
  return (
    <div className="relative w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center shadow-inner select-none">
      {/* Main Wheel Surface (Touch area simulated) */}
      <div className="absolute inset-0 rounded-full border border-gray-300 opacity-20 pointer-events-none"></div>

      {/* Buttons Layout */}
      
      {/* MENU (Top) */}
      <button 
        onClick={onMenu}
        className="absolute top-4 font-bold text-gray-500 text-sm tracking-widest hover:text-gray-800 transition-colors active:scale-95"
      >
        MENU
      </button>

      {/* PREV (Left) */}
      <button 
        onClick={onPrev}
        className="absolute left-4 text-gray-500 text-xl hover:text-gray-800 transition-colors active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="19 20 9 12 19 4 19 20"></polygon>
          <line x1="5" y1="19" x2="5" y2="5"></line>
        </svg>
      </button>

      {/* NEXT (Right) */}
      <button 
        onClick={onNext}
        className="absolute right-4 text-gray-500 text-xl hover:text-gray-800 transition-colors active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 4 15 12 5 20 5 4"></polygon>
          <line x1="19" y1="5" x2="19" y2="19"></line>
        </svg>
      </button>

      {/* PLAY/PAUSE (Bottom) */}
      <button 
        onClick={onPlayPause}
        className="absolute bottom-4 text-gray-500 text-xl hover:text-gray-800 transition-colors active:scale-95 flex items-end"
      >
        {isPlaying ? (
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mb-1">
             <rect x="6" y="4" width="4" height="16"></rect>
             <rect x="14" y="4" width="4" height="16"></rect>
           </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mb-1">
             <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </button>

      {/* Center Button */}
      <button 
        onClick={onSelect}
        className="w-24 h-24 bg-gradient-to-b from-gray-100 to-gray-300 rounded-full shadow-md active:shadow-inner active:from-gray-300 active:to-gray-400 outline-none border border-gray-300"
      >
      </button>
    </div>
  );
};
