import React, { useState, useRef } from 'react';
import { MAX_BPM, MIN_BPM } from '../constants';

interface TapPadProps {
  setBpm: (bpm: number) => void;
}

export const TapPad: React.FC<TapPadProps> = ({ setBpm }) => {
  const [isPressed, setIsPressed] = useState(false);
  const tapsRef = useRef<number[]>([]);
  const timeoutRef = useRef<number>();

  const handleTap = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    const now = performance.now();
    const taps = tapsRef.current;

    // Reset if it's been too long (2 seconds)
    if (taps.length > 0 && now - taps[taps.length - 1] > 2000) {
      tapsRef.current = [];
    }

    tapsRef.current.push(now);

    // Keep only last 4 taps
    if (tapsRef.current.length > 4) {
      tapsRef.current.shift();
    }

    if (tapsRef.current.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapsRef.current.length; i++) {
        intervals.push(tapsRef.current[i] - tapsRef.current[i - 1]);
      }
      
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      let newBpm = Math.round(60000 / avgInterval);

      if (newBpm < MIN_BPM) newBpm = MIN_BPM;
      if (newBpm > MAX_BPM) newBpm = MAX_BPM;

      setBpm(newBpm);
    }
  };

  return (
    <div 
      className={`
        w-full h-40 sm:h-48 rounded-3xl border border-white/10 
        bg-gradient-to-b from-white/5 to-transparent 
        relative overflow-hidden cursor-pointer touch-manipulation select-none
        transition-all duration-100
        ${isPressed ? 'scale-[0.98] border-brand/50 bg-brand/5' : 'hover:border-white/20'}
      `}
      onClick={handleTap}
    >
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-4 opacity-30" 
        style={{
            backgroundImage: `radial-gradient(circle, ${isPressed ? '#D4EA6B' : '#555'} 1px, transparent 1px)`,
            backgroundSize: '12px 12px'
        }}
      ></div>
      
      {/* Center Label (optional, implicit in UI design) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className={`font-tech tracking-widest text-sm ${isPressed ? 'text-brand' : 'text-white/20'}`}>
          TAP TEMPO
        </span>
      </div>
    </div>
  );
};