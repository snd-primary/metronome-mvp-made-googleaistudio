import React from 'react';

interface BpmDisplayProps {
  bpm: number;
}

export const BpmDisplay: React.FC<BpmDisplayProps> = ({ bpm }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 select-none">
      <h1 className="text-8xl md:text-9xl font-display font-bold text-brand tracking-widest leading-none" style={{ textShadow: '0 0 20px rgba(212, 234, 107, 0.4)' }}>
        {bpm}
      </h1>
      <span className="text-brand text-xl font-display tracking-[0.2em] mt-2 opacity-80">BPM</span>
    </div>
  );
};