import React from 'react';
import { StringName, TuningResult } from '../types';
import { TRANSLATIONS, Language } from '../constants';

interface TunerDisplayProps {
  selectedString: StringName;
  tuningResult: TuningResult | null;
  isListening: boolean;
  language: Language;
  onToggleLanguage: () => void;
}

export const TunerDisplay: React.FC<TunerDisplayProps> = ({ 
  selectedString, 
  tuningResult,
  isListening,
  language,
  onToggleLanguage
}) => {
  const t = TRANSLATIONS[language];
  
  // Calculate needle rotation (-45deg to 45deg)
  let rotation = 0;
  let statusColor = 'text-gray-400';
  let feedbackText = t.ready;

  if (tuningResult) {
    const clampedCents = Math.max(-50, Math.min(50, tuningResult.cents));
    rotation = (clampedCents / 50) * 45;

    if (tuningResult.isTuned) {
      statusColor = 'text-green-500';
      feedbackText = t.perfect;
    } else if (tuningResult.cents < 0) {
      statusColor = 'text-amber-500';
      feedbackText = t.flat;
    } else {
      statusColor = 'text-red-500';
      feedbackText = t.sharp;
    }
  }

  // Format String Name Display
  const getDisplayString = (s: StringName) => {
    if (s === StringName.AUTO) return t.auto;
    if (s === StringName.E2) return `E (${t.low})`;
    if (s === StringName.E4) return `E (${t.high})`;
    // For A, D, G, B just return the letter (remove numbers from enum key if present, but here enum values are E2 etc)
    // Enum values are 'E2', 'A2', etc. We just want the first letter usually.
    return s.charAt(0);
  };

  // Status Bar Date/Time
  const now = new Date();
  const timeString = now.toLocaleTimeString(t.dateFormat === 'zh-CN' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden relative">
      {/* Header / Status Bar */}
      <div className="h-6 bg-gradient-to-b from-gray-200 to-gray-100 flex items-center justify-between px-2 border-b border-gray-300 select-none">
        <button 
          onClick={onToggleLanguage}
          className="text-[10px] font-semibold text-gray-600 hover:text-blue-600 cursor-pointer active:scale-95 transition-transform flex items-center gap-1"
          title="Switch Language"
        >
          {language === 'zh' ? '爱调音' : 'iTune'}
          <span className="text-[8px] bg-gray-300 px-1 rounded text-gray-600">{language === 'zh' ? '中' : 'EN'}</span>
        </button>
        <span className="text-[10px] font-semibold text-gray-600 flex items-center gap-1">
           {isListening ? 
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> : 
             <span className="text-gray-400">||</span> 
           }
           {timeString}
           <div className="w-4 h-2 border border-gray-500 ml-1 relative">
             <div className="absolute left-0 top-0 h-full bg-gray-500 w-3/4"></div>
           </div>
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 flex flex-col items-center justify-between bg-gradient-to-br from-white to-blue-50">
        
        {/* Selected String Mode */}
        <div className="text-center w-full">
           <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">{t.stringSelect}</h3>
           <div className="text-xl font-bold text-gray-800 mt-1 border-b-2 border-gray-200 pb-2 inline-block px-6">
             {getDisplayString(selectedString)}
           </div>
        </div>

        {/* The Note Display */}
        <div className="flex flex-col items-center justify-center flex-1 w-full">
          {isListening ? (
             tuningResult ? (
               <>
                <div className={`text-8xl font-bold ${statusColor} transition-colors duration-200 leading-none`}>
                  {tuningResult.note}
                </div>
                <div className="mt-2 text-sm font-mono text-gray-500">
                  {tuningResult.frequency.toFixed(1)} Hz
                </div>
               </>
             ) : (
               <div className="text-gray-300 animate-pulse flex flex-col items-center">
                  <span className="text-6xl">•••</span>
                  <span className="text-xs mt-2">{t.pluckString}</span>
               </div>
             )
          ) : (
            <div className="text-gray-400 text-center px-8">
              <p className="mb-2 text-4xl opacity-30">♫</p>
              <p className="text-sm font-medium">{t.pressPlay}</p>
              <p className="text-xs mt-1">{t.toStart}</p>
            </div>
          )}
        </div>

        {/* The Analog Gauge */}
        <div className="relative w-48 h-24 mb-2 overflow-hidden">
           {/* Arc Background */}
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border-[12px] border-gray-200 box-border"></div>
           
           {/* Tick Marks */}
           <div className="absolute bottom-0 left-1/2 w-1 h-4 bg-green-500 -translate-x-1/2 origin-bottom"></div>
           <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-gray-300 -translate-x-1/2 origin-bottom -rotate-[22.5deg] translate-y-[-60px]"></div>
           <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-gray-300 -translate-x-1/2 origin-bottom rotate-[22.5deg] translate-y-[-60px]"></div>
           
           {/* The Needle */}
           <div 
             className="absolute bottom-0 left-1/2 w-1 h-[80px] bg-red-600 origin-bottom -translate-x-1/2 rounded-full shadow-sm transition-transform duration-100 ease-out z-10"
             style={{ transform: `translateX(-50%) rotate(${isListening ? rotation : -45}deg)` }}
           >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full shadow-md"></div>
           </div>

           {/* Gauge Cover (Bottom half) */}
           <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent z-20"></div>
        </div>

        {/* Status Text */}
        <div className={`h-8 font-semibold tracking-wide uppercase ${isListening ? (tuningResult?.isTuned ? 'text-green-600' : 'text-gray-500') : 'text-gray-300'}`}>
          {isListening ? (tuningResult ? feedbackText : t.listening) : t.paused}
        </div>

      </div>
    </div>
  );
};
