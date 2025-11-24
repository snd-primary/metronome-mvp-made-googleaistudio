import React from 'react';
import { createRoot } from 'react-dom/client';
import { useMetronome } from './hooks/useMetronome';
import { BpmDisplay } from './components/BpmDisplay';
import { Visualizer } from './components/Visualizer';
import { Selectors } from './components/Selectors';
import { TapPad } from './components/TapPad';
import { VolumeSlider } from './components/VolumeSlider';
import { BpmSlider } from './components/BpmSlider';
import { DEFAULT_BPM, DEFAULT_BEATS, DEFAULT_SUBDIVISION } from './constants';

const App = () => {
  const {
    isPlaying,
    setIsPlaying,
    bpm,
    setBpm,
    beatsPerBar,
    setBeatsPerBar,
    subdivision,
    setSubdivision,
    volume,
    setVolume,
    activeBeat
  } = useMetronome({
    initialBpm: DEFAULT_BPM,
    initialBeats: DEFAULT_BEATS,
    initialSubdivision: DEFAULT_SUBDIVISION
  });

  return (
    <div className="min-h-[100dvh] w-full bg-black text-white flex flex-col items-center justify-between p-6 max-w-lg mx-auto font-sans relative overflow-hidden">
      
      {/* Top Section: BPM Display */}
      <div className="w-full flex-shrink-0 mb-4">
        <BpmDisplay bpm={bpm} />
      </div>

      {/* Visualizer Section */}
      <div className="w-full flex-shrink-0 mb-4">
        <Visualizer 
          beatsPerBar={beatsPerBar} 
          subdivision={subdivision} 
          activeBeat={activeBeat} 
          isPlaying={isPlaying} 
        />
      </div>

      {/* Selectors Section */}
      <div className="w-full flex-shrink-0 mb-8">
        <Selectors 
          beatsPerBar={beatsPerBar} 
          setBeatsPerBar={setBeatsPerBar}
          subdivision={subdivision} 
          setSubdivision={setSubdivision}
        />
      </div>

      {/* Middle Control Section: Tap Pad & Volume */}
      <div className="w-full flex gap-4 mb-8 flex-shrink-0 px-2">
        <div className="flex-1">
          <TapPad setBpm={setBpm} />
        </div>
        <div className="flex-shrink-0">
          <VolumeSlider volume={volume} setVolume={setVolume} />
        </div>
      </div>

      {/* Bottom Control Section: BPM Slider */}
      <div className="w-full mb-8 flex-shrink-0">
        <BpmSlider bpm={bpm} setBpm={setBpm} />
      </div>

      {/* Play/Pause Button */}
      <div className="w-full flex justify-center pb-4 flex-shrink-0">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`
            w-24 h-24 rounded-[2rem] flex items-center justify-center 
            transition-all duration-200 transform active:scale-95
            ${isPlaying 
              ? 'bg-transparent border-2 border-brand text-brand shadow-[0_0_15px_rgba(212,234,107,0.2)]' 
              : 'bg-brand text-black shadow-[0_0_30px_rgba(212,234,107,0.4)]'
            }
          `}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
             <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
             <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="ml-2"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
      </div>

    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);