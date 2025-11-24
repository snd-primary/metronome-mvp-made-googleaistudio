import React from 'react';

interface VolumeSliderProps {
  volume: number;
  setVolume: (v: number) => void;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({ volume, setVolume }) => {
  return (
    <div className="h-40 sm:h-48 w-12 sm:w-16 relative flex flex-col items-center justify-end">
      <div className="relative w-full h-full bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 group">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {/* Fill */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-brand transition-all duration-100"
          style={{ height: `${volume * 100}%` }}
        >
            {/* Texture on the bar */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' viewBox=\'0 0 4 4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h4v4H0z\' fill=\'%23000\' fill-opacity=\'0.4\'/%3E%3C/svg%3E")'}}></div>
        </div>

        {/* Icon at bottom */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-black/50 pointer-events-none z-0">
          {volume === 0 ? (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
          ) : (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          )}
        </div>
      </div>
      
      {/* Icon below (for mute status in design) */}
      <div className="absolute -bottom-8 text-brand/50">
         {volume === 0 && <span className="text-xs font-tech">MUTED</span>}
      </div>
    </div>
  );
};