import { useState, useEffect, useRef, useCallback } from 'react';
import { Subdivision, BeatEvent } from '../types';

interface UseMetronomeProps {
  initialBpm?: number;
  initialBeats?: number;
  initialSubdivision?: Subdivision;
}

export const useMetronome = ({
  initialBpm = 120,
  initialBeats = 4,
  initialSubdivision = 1
}: UseMetronomeProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(initialBpm);
  const [beatsPerBar, setBeatsPerBar] = useState(initialBeats);
  const [subdivision, setSubdivision] = useState(initialSubdivision);
  const [volume, setVolume] = useState(0.5);

  // Audio Context Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);
  
  // Scheduling State
  const currentBeatRef = useRef(0);     // The main beat (0, 1, 2, 3...)
  const currentSubBeatRef = useRef(0);  // The sub beat (0, 1...) within the main beat
  
  // UI Sync Refs
  const scheduledNotesRef = useRef<BeatEvent[]>([]);
  const [activeBeat, setActiveBeat] = useState<{ beat: number; subBeat: number } | null>(null);

  // Lookahead constants
  const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

  // Initialize AudioContext
  const ensureAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playClick = useCallback((time: number, beat: number, subBeat: number) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Frequency logic
    if (beat === 0 && subBeat === 0) {
      osc.frequency.value = 1000; // High pitch for downbeat
    } else if (subBeat === 0) {
      osc.frequency.value = 800;  // Medium pitch for quarter notes
    } else {
      osc.frequency.value = 600;  // Low pitch for subdivisions
    }

    // Volume logic
    gainNode.gain.setValueAtTime(volume, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.start(time);
    osc.stop(time + 0.055);
  }, [volume]);

  const scheduleNote = useCallback((beatNumber: number, subBeatNumber: number, time: number) => {
    // 1. Schedule Audio
    playClick(time, beatNumber, subBeatNumber);

    // 2. Push to visual queue
    scheduledNotesRef.current.push({
      beat: beatNumber,
      subBeat: subBeatNumber,
      time: time
    });
  }, [playClick]);

  const nextNote = useCallback(() => {
    const secondsPerBeat = 60.0 / bpm;
    const secondsPerSubDivision = secondsPerBeat / subdivision;

    nextNoteTimeRef.current += secondsPerSubDivision;

    currentSubBeatRef.current++;
    if (currentSubBeatRef.current >= subdivision) {
      currentSubBeatRef.current = 0;
      currentBeatRef.current++;
      if (currentBeatRef.current >= beatsPerBar) {
        currentBeatRef.current = 0;
      }
    }
  }, [bpm, subdivision, beatsPerBar]);

  const scheduler = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // While there are notes that will need to play before the next interval, schedule them
    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      scheduleNote(currentBeatRef.current, currentSubBeatRef.current, nextNoteTimeRef.current);
      nextNote();
    }
    
    timerIDRef.current = window.setTimeout(scheduler, lookahead);
  }, [scheduleNote, nextNote]);

  // Start/Stop Logic
  useEffect(() => {
    if (isPlaying) {
      ensureAudioContext();
      if (!audioContextRef.current) return;

      currentBeatRef.current = 0;
      currentSubBeatRef.current = 0;
      nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.05;
      
      scheduler();
    } else {
      if (timerIDRef.current) window.clearTimeout(timerIDRef.current);
      scheduledNotesRef.current = [];
      setActiveBeat(null);
    }

    return () => {
      if (timerIDRef.current) window.clearTimeout(timerIDRef.current);
    };
  }, [isPlaying, ensureAudioContext, scheduler]);

  // Visual Sync Loop
  useEffect(() => {
    let animationFrameId: number;

    const draw = () => {
      const ctx = audioContextRef.current;
      if (!ctx || !isPlaying) return;

      const currentTime = ctx.currentTime;
      
      // Check queue for notes that should be displayed now
      while (scheduledNotesRef.current.length && scheduledNotesRef.current[0].time < currentTime) {
        const currentNote = scheduledNotesRef.current[0];
        setActiveBeat({ beat: currentNote.beat, subBeat: currentNote.subBeat });
        scheduledNotesRef.current.shift(); // Remove processed note
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return {
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
    activeBeat,
  };
};