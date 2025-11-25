import React, { useState, useEffect, useRef } from 'react';
import { AudioAnalyzer } from './services/audioAnalyzer';
import { ClickWheel } from './components/ClickWheel';
import { TunerDisplay } from './components/TunerDisplay';
import { StringName, TuningResult } from './types';
import { Language, TRANSLATIONS } from './constants';

const App: React.FC = () => {
  // State
  const [isListening, setIsListening] = useState(false);
  const [selectedStringIndex, setSelectedStringIndex] = useState(6); // Default to Auto (index 6)
  const [tuningResult, setTuningResult] = useState<TuningResult | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [showHelp, setShowHelp] = useState(false);
  
  // Refs
  const analyzerRef = useRef<AudioAnalyzer | null>(null);
  const requestRef = useRef<number>(0);
  const lastManualIndexRef = useRef<number>(0); // Default to E2

  // Translations accessor
  const t = TRANSLATIONS[language];

  // String Logic
  // Order for cycling: E2, A2, D3, G3, B3, E4, AUTO
  const selectionOrder = [
    StringName.E2,
    StringName.A2,
    StringName.D3,
    StringName.G3,
    StringName.B3,
    StringName.E4,
    StringName.AUTO
  ];

  const autoIndex = selectionOrder.length - 1;
  const currentString = selectionOrder[selectedStringIndex];

  const initAnalyzer = async () => {
    if (!analyzerRef.current) {
      analyzerRef.current = new AudioAnalyzer();
    }
    try {
      await analyzerRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error("Failed to start audio", e);
      alert(language === 'zh' ? "需要麦克风权限来调音" : "Microphone access is required to tune your guitar.");
    }
  };

  const stopAnalyzer = () => {
    if (analyzerRef.current) {
      // We don't fully stop the context to allow quick resume, 
      // but we stop the loop logic updates via state
      setIsListening(false);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      setTuningResult(null);
    }
  };

  // Main Analysis Loop
  useEffect(() => {
    if (!isListening) return;

    const analyze = () => {
       if (analyzerRef.current) {
         const pitch = analyzerRef.current.getPitch();
         if (pitch > 0) {
            const result = analyzerRef.current.calculateTuningResult(pitch, selectionOrder[selectedStringIndex]);
            setTuningResult(result);
         }
       }
       requestRef.current = requestAnimationFrame(analyze);
    };

    requestRef.current = requestAnimationFrame(analyze);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isListening, selectedStringIndex]);


  // Button Handlers
  const handleTogglePlay = () => {
    // If in help screen, play button does nothing or acts as select
    if (showHelp) return;

    if (isListening) {
      stopAnalyzer();
    } else {
      initAnalyzer();
    }
  };

  const handleNext = () => {
    if (showHelp) return; // Disable wheel in help for now
    setSelectedStringIndex((prev) => {
      const next = (prev + 1) % selectionOrder.length;
      if (next !== autoIndex) {
        lastManualIndexRef.current = next;
      }
      return next;
    });
  };

  const handlePrev = () => {
    if (showHelp) return; // Disable wheel in help for now
    setSelectedStringIndex((prev) => {
      const next = (prev - 1 + selectionOrder.length) % selectionOrder.length;
      if (next !== autoIndex) {
        lastManualIndexRef.current = next;
      }
      return next;
    });
  };

  const handleMenu = () => {
    if (showHelp) {
      setShowHelp(false);
      return;
    }

    if (selectedStringIndex === autoIndex) {
      // Currently in Auto, switch to last Manual string
      setSelectedStringIndex(lastManualIndexRef.current);
    } else {
      // Currently in Manual, switch to Auto
      // Save current manual selection just in case
      lastManualIndexRef.current = selectedStringIndex;
      setSelectedStringIndex(autoIndex);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const toggleHelp = () => {
    setShowHelp(prev => !prev);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-200 p-4 overflow-hidden safe-area-view">
      
      {/* The "iPod" Device Container - Scaled to fit small screens */}
      <div className="relative w-full max-w-[320px] aspect-[320/520] max-h-[85vh] bg-gradient-to-b from-gray-100 to-gray-300 rounded-[30px] shadow-2xl border-4 border-white ring-1 ring-gray-300 flex flex-col items-center p-6 shrink-0">
        
        {/* Screen Container */}
        <div className="w-full h-[45%] bg-black rounded-[6px] border-2 border-gray-400 overflow-hidden shadow-inner mb-6 relative group">
          {/* Screen Overlay Glare */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-10 pointer-events-none z-30"></div>
          <TunerDisplay 
             selectedString={currentString} 
             tuningResult={tuningResult}
             isListening={isListening}
             language={language}
             onToggleLanguage={toggleLanguage}
             showHelp={showHelp}
             onToggleHelp={toggleHelp}
          />
        </div>

        {/* Controls Container */}
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="scale-[0.85] sm:scale-100 transform-origin-center">
            <ClickWheel 
              onNext={handleNext}
              onPrev={handlePrev}
              onMenu={handleMenu}
              onPlayPause={handleTogglePlay}
              onSelect={handleTogglePlay} // Select usually acts like enter/play
              isPlaying={isListening}
            />
          </div>
        </div>

        {/* Reflection/Bottom Highlight */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent opacity-5 rounded-b-[26px] pointer-events-none"></div>

      </div>
      
      {/* Footer Info */}
      <div className="mt-4 text-gray-500 text-xs font-medium tracking-wider text-center opacity-80">
        <p>{language === 'zh' ? '加州设计' : 'Designed in California'}</p>
        <p className="mt-1 text-[10px] opacity-60">{t.footerDedication}</p>
      </div>

    </div>
  );
};

export default App;