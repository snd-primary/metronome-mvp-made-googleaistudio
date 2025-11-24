import React, { useState } from 'react';
import { Subdivision } from '../types';

interface SelectorsProps {
  beatsPerBar: number;
  setBeatsPerBar: (b: number) => void;
  subdivision: Subdivision;
  setSubdivision: (s: Subdivision) => void;
}

// Simple icons for notes
const QuarterNoteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
);
const EighthNoteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z M20 7h-4v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7z"/></svg>
); 
// Note: Using Quarter note as generic "Subdivision" icon for the button,
// The modal will allow selection.

export const Selectors: React.FC<SelectorsProps> = ({ 
  beatsPerBar, 
  setBeatsPerBar, 
  subdivision, 
  setSubdivision 
}) => {
  const [showBeatModal, setShowBeatModal] = useState(false);
  const [showRhythmModal, setShowRhythmModal] = useState(false);

  const availableBeats = [2, 3, 4, 5, 6, 7, 8, 9];
  const availableSubdivisions = [
    { value: 1, label: 'Quarter' },
    { value: 2, label: 'Eighth' },
    { value: 3, label: 'Triplet' },
    { value: 4, label: 'Sixteenth' },
  ];

  return (
    <div className="flex justify-center items-center gap-8 mb-8 relative z-20">
      
      {/* Beat Selector */}
      <button 
        onClick={() => setShowBeatModal(true)}
        className="w-32 h-14 border-2 border-brand rounded text-3xl font-display text-brand flex items-center justify-center hover:bg-brand hover:text-black transition-colors"
      >
        {beatsPerBar}/4
      </button>

      <div className="w-px h-14 bg-white/20"></div>

      {/* Rhythm Selector */}
      <button 
        onClick={() => setShowRhythmModal(true)}
        className="w-16 h-14 border-2 border-brand rounded flex items-center justify-center text-brand hover:bg-brand hover:text-black transition-colors"
      >
        <span className="text-3xl">♪</span>
      </button>

      {/* Modals - Minimal Implementation */}
      {showBeatModal && (
        <>
          <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setShowBeatModal(false)} />
          <div className="absolute top-16 left-1/2 -translate-x-[calc(50%+4rem)] bg-brand-dark border border-brand p-4 rounded-lg z-50 grid grid-cols-4 gap-2 w-64 shadow-[0_0_20px_rgba(212,234,107,0.2)]">
            {availableBeats.map(b => (
              <button
                key={b}
                onClick={() => { setBeatsPerBar(b); setShowBeatModal(false); }}
                className={`p-2 font-display text-xl rounded ${beatsPerBar === b ? 'bg-brand text-black' : 'text-brand hover:bg-white/10'}`}
              >
                {b}
              </button>
            ))}
          </div>
        </>
      )}

      {showRhythmModal && (
        <>
          <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setShowRhythmModal(false)} />
          <div className="absolute top-16 left-1/2 translate-x-4 bg-brand-dark border border-brand p-4 rounded-lg z-50 flex flex-col gap-2 w-48 shadow-[0_0_20px_rgba(212,234,107,0.2)]">
            {availableSubdivisions.map(s => (
              <button
                key={s.value}
                onClick={() => { setSubdivision(s.value); setShowRhythmModal(false); }}
                className={`p-2 text-left font-tech text-lg rounded flex justify-between items-center ${subdivision === s.value ? 'bg-brand text-black' : 'text-brand hover:bg-white/10'}`}
              >
                <span>{s.label}</span>
                <span className="text-xs opacity-60">1/{s.value}</span>
              </button>
            ))}
          </div>
        </>
      )}

    </div>
  );
};