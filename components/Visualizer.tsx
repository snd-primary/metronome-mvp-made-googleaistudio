import React from 'react';
import { Subdivision } from '../types';

interface VisualizerProps {
  beatsPerBar: number;
  subdivision: Subdivision;
  activeBeat: { beat: number; subBeat: number } | null;
  isPlaying: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ beatsPerBar, subdivision, activeBeat, isPlaying }) => {
  // We render a circle for each beat in the bar
  const circles = Array.from({ length: beatsPerBar }, (_, i) => i);

  // Helper to create donut segments
  const createSegments = (beatIndex: number) => {
    const segments = [];
    const radius = 40;
    const center = 50;
    const strokeWidth = 18; // Thicker donut
    
    // Gap calculation
    const gap = subdivision > 1 ? 4 : 0; // Degrees of gap
    const totalGap = gap * subdivision;
    const availableAngle = 360 - totalGap;
    const segmentAngle = availableAngle / subdivision;

    for (let i = 0; i < subdivision; i++) {
      // Rotation calculations to start from top (-90deg)
      const startAngle = (i * (segmentAngle + gap)) - 90;
      const endAngle = startAngle + segmentAngle;
      
      // Polar to Cartesian
      const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
      const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
      const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
      const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);

      // SVG Path command for an arc
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      
      // For a perfect circle (subdivision 1), we use a circle element instead of path to avoid glitch
      if (subdivision === 1) {
        const isActive = isPlaying && activeBeat?.beat === beatIndex && activeBeat.subBeat === 0;
        segments.push(
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className={`transition-colors duration-100 ${isActive ? 'text-brand drop-shadow-[0_0_8px_rgba(212,234,107,0.8)]' : 'text-brand-dim'}`}
          />
        );
        continue;
      }

      const d = [
        "M", x1, y1,
        "A", radius, radius, 0, largeArcFlag, 1, x2, y2
      ].join(" ");

      // Logic to determine if this segment is active
      // It is active if:
      // 1. It is the current beat AND current subBeat
      // 2. OR if we want to show progress, maybe previous subBeats in current beat stay lit? 
      // Let's stick to "Current Active" logic for precision.
      const isSegmentActive = isPlaying && activeBeat?.beat === beatIndex && activeBeat?.subBeat === i;
      
      // Alternative logic: Fill up the circle?
      // "Donut fills with color" -> segments 0..i are active?
      // Let's try "Fill up":
      const isSegmentFilled = isPlaying && activeBeat?.beat === beatIndex && i <= activeBeat?.subBeat;
      // If the beat is past, should it remain filled? Usually metronomes clear the previous beat.
      // Let's do: Only current beat fills up. Other beats are empty.
      
      segments.push(
        <path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="butt" // "round" makes gap calculation harder
          className={`transition-colors duration-75 ${isSegmentFilled ? 'text-brand drop-shadow-[0_0_5px_rgba(212,234,107,0.6)]' : 'text-brand-dim opacity-40'}`}
        />
      );
    }
    
    // Add a center dot or decoration
    segments.push(
      <circle 
        key="center" 
        cx={center} 
        cy={center} 
        r={6} 
        className={`${(isPlaying && activeBeat?.beat === beatIndex) ? 'fill-brand' : 'fill-black'}`}
      />
    );

    return segments;
  };

  return (
    <div className="w-full flex justify-center items-center gap-2 px-4 mb-4">
      {circles.map((beatIndex) => (
        <div key={beatIndex} className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full transform transition-transform">
            {createSegments(beatIndex)}
          </svg>
        </div>
      ))}
    </div>
  );
};