import React, { useRef, useState } from 'react';
import { MAX_BPM, MIN_BPM, RULER_TICK_SPACING } from '../constants';

interface BpmSliderProps {
  bpm: number;
  setBpm: (bpm: number) => void;
}

export const BpmSlider: React.FC<BpmSliderProps> = ({ bpm, setBpm }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startBpmRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const range = MAX_BPM - MIN_BPM;
  
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startBpmRef.current = bpm;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    // Dragging LEFT (negative deltaX) should INCREASE BPM (bringing right-side higher numbers into view)
    const deltaX = startXRef.current - e.clientX; 
    const bpmDelta = Math.round(deltaX / RULER_TICK_SPACING); 
    
    const newBpm = Math.min(MAX_BPM, Math.max(MIN_BPM, startBpmRef.current + bpmDelta));
    
    if (newBpm !== bpm) {
        setBpm(newBpm);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (e.target instanceof HTMLElement) {
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="w-full select-none px-2">
      {/* Controls Row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <button 
           className="w-12 h-12 rounded-full border border-brand/30 text-brand flex items-center justify-center hover:bg-brand hover:text-black active:scale-95 transition-all flex-shrink-0"
           onClick={() => setBpm(Math.max(MIN_BPM, bpm - 1))}
           aria-label="Decrease BPM"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
        </button>
        
        {/* Ruler Window */}
        <div className="flex-1 h-16 relative overflow-hidden group cursor-ew-resize rounded-lg border-x border-brand/20 bg-white/5"
             onPointerDown={handlePointerDown}
             onPointerMove={handlePointerMove}
             onPointerUp={handlePointerUp}
             onPointerLeave={handlePointerUp}
             ref={containerRef}
        >
             {/* Center Indicator (Cursor) */}
             <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-brand z-10 -translate-x-1/2 shadow-[0_0_8px_#D4EA6B]"></div>
             
             {/* Moving Ruler Strip */}
             <div 
               className="absolute top-0 bottom-0 flex items-center"
               style={{ 
                 left: '50%',
                 transform: `translateX(-${(bpm - MIN_BPM) * RULER_TICK_SPACING}px)`,
                 willChange: 'transform',
                 transition: isDragging ? 'none' : 'transform 0.1s ease-out'
               }}
             >
                {Array.from({ length: range + 1 }).map((_, i) => {
                  const tickBpm = MIN_BPM + i;
                  const isMajor = tickBpm % 10 === 0;
                  const isMid = tickBpm % 5 === 0 && !isMajor;
                  
                  return (
                    <div 
                      key={tickBpm} 
                      className="absolute flex flex-col items-center justify-center"
                      style={{ 
                          left: `${i * RULER_TICK_SPACING}px`, 
                          width: '2px', 
                          transform: 'translateX(-50%)' 
                      }}
                    >
                      {/* Tick Line */}
                      <div 
                        className={`w-0.5 rounded-full ${
                            isMajor ? 'h-8 bg-brand/80' : 
                            isMid ? 'h-5 bg-brand/40' : 'h-3 bg-brand/20'
                        }`} 
                      />
                      
                      {/* BPM Label for major ticks */}
                      {isMajor && (
                        <span className="absolute top-10 text-[9px] text-brand/50 font-tech tracking-wider">
                          {tickBpm}
                        </span>
                      )}
                    </div>
                  );
                })}
             </div>
             
             {/* Gradient Fade Masks */}
             <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none"></div>
             <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none"></div>
        </div>

        <button 
           className="w-12 h-12 rounded-full border border-brand/30 text-brand flex items-center justify-center hover:bg-brand hover:text-black active:scale-95 transition-all flex-shrink-0"
           onClick={() => setBpm(Math.min(MAX_BPM, bpm + 1))}
           aria-label="Increase BPM"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
      </div>
      
      {/* Secondary BPM display below slider (per design) */}
      <div className="text-center">
         <span className="font-display text-2xl text-white tracking-widest leading-none">
            {bpm}<span className="text-xs text-neutral-500 ml-1 font-sans">bpm</span>
         </span>
      </div>
    </div>
  );
};