import React from 'react';
import { StringName, TuningResult } from '../types';
import { TRANSLATIONS, Language } from '../constants';

interface TunerDisplayProps {
  selectedString: StringName;
  tuningResult: TuningResult | null;
  isListening: boolean;
  language: Language;
  onToggleLanguage: () => void;
  showHelp: boolean;
  onToggleHelp: () => void;
}

export const TunerDisplay: React.FC<TunerDisplayProps> = ({ 
  selectedString, 
  tuningResult,
  isListening,
  language,
  onToggleLanguage,
  showHelp,
  onToggleHelp
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

  const renderHelpContent = () => (
    <div className="flex-1 w-full p-4 flex flex-col items-start justify-start text-left overflow-y-auto bg-white text-gray-800 scrollbar-hide">
       <h2 className="text-sm font-bold border-b border-gray-300 w-full pb-1 mb-2 uppercase tracking-wider text-blue-600">
         {t.helpTitle}
       </h2>
       <div className="text-[10px] leading-relaxed space-y-1">
          {t.helpContent.map((line, idx) => (
            <p key={idx} className={idx === 0 || idx === t.helpContent.length - 1 ? "font-semibold mb-1 mt-1" : "pl-1 text-gray-600"}>
              {line}
            </p>
          ))}
       </div>
    </div>
  );

  const renderTunerContent = () => (
    <div className="flex-1 p-2 flex flex-col items-center justify-between w-full h-full bg-gradient-to-br from-white to-blue-50 overflow-hidden">
        
        {/* Selected String Mode */}
        <div className="text-center w-full shrink-0">
           <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{t.stringSelect}</h3>
           <div className="text-lg font-bold text-gray-800 mt-0.5 border-b-2 border-gray-200 pb-1 inline-block px-6">
             {getDisplayString(selectedString)}
           </div>
        </div>

        {/* The Note Display */}
        <div className="flex flex-col items-center justify-center flex-1 w-full min-h-0">
          {isListening ? (
             tuningResult ? (
               <>
                <div className={`text-7xl sm:text-8xl font-bold ${statusColor} transition-colors duration-200 leading-none`}>
                  {tuningResult.note}
                </div>
                <div className="mt-1 text-xs font-mono text-gray-500">
                  {tuningResult.frequency.toFixed(1)} Hz
                </div>
               </>
             ) : (
               <div className="text-gray-300 animate-pulse flex flex-col items-center">
                  <span className="text-5xl sm:text-6xl">•••</span>
                  <span className="text-xs mt-2">{t.pluckString}</span>
               </div>
             )
          ) : (
            <div className="text-gray-400 text-center px-4">
              <p className="mb-2 text-3xl opacity-30">♫</p>
              <p className="text-sm font-medium">{t.pressPlay}</p>
              <p className="text-[10px] mt-1">{t.toStart}</p>
            </div>
          )}
        </div>

        {/* The Analog Gauge */}
        <div className="relative w-48 h-20 mb-1 overflow-hidden shrink-0">
           {/* Arc Background */}
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border-[10px] border-gray-200 box-border"></div>
           
           {/* Tick Marks */}
           <div className="absolute bottom-0 left-1/2 w-1 h-3 bg-green-500 -translate-x-1/2 origin-bottom"></div>
           <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-gray-300 -translate-x-1/2 origin-bottom -rotate-[22.5deg] translate-y-[-58px]"></div>
           <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-gray-300 -translate-x-1/2 origin-bottom rotate-[22.5deg] translate-y-[-58px]"></div>
           
           {/* The Needle */}
           <div 
             className="absolute bottom-0 left-1/2 w-1 h-[70px] bg-red-600 origin-bottom -translate-x-1/2 rounded-full shadow-sm transition-transform duration-100 ease-out z-10"
             style={{ transform: `translateX(-50%) rotate(${isListening ? rotation : -45}deg)` }}
           >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-red-600 rounded-full shadow-md"></div>
           </div>

           {/* Gauge Cover (Bottom half) */}
           <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent z-20"></div>
        </div>

        {/* Status Text */}
        <div className={`h-6 text-sm font-semibold tracking-wide uppercase shrink-0 ${isListening ? (tuningResult?.isTuned ? 'text-green-600' : 'text-gray-500') : 'text-gray-300'}`}>
          {isListening ? (tuningResult ? feedbackText : t.listening) : t.paused}
        </div>

      </div>
  );

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden relative">
      {/* Header / Status Bar */}
      <div className="h-6 bg-gradient-to-b from-gray-200 to-gray-100 flex items-center justify-between px-2 border-b border-gray-300 select-none shrink-0 z-50">
        <button 
          onClick={onToggleLanguage}
          className="text-[10px] font-semibold text-gray-600 hover:text-blue-600 cursor-pointer active:scale-95 transition-transform flex items-center gap-1"
          title="Switch Language"
        >
          {language === 'zh' ? '爱调音' : 'iTune'}
          <span className="text-[8px] bg-gray-300 px-1 rounded text-gray-600">{language === 'zh' ? '中' : 'EN'}</span>
        </button>
        <span className="text-[10px] font-semibold text-gray-600 flex items-center gap-2">
           {/* Help Button */}
           <button 
              onClick={onToggleHelp}
              className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] border transition-all ${showHelp ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-500 border-gray-400 hover:border-blue-500 hover:text-blue-500'}`}
              title={t.help}
           >
             ?
           </button>

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
      {showHelp ? renderHelpContent() : renderTunerContent()}
    </div>
  );
};
