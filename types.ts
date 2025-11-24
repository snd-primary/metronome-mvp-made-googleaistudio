export enum Subdivision {
  Quarter = 1,
  Eighth = 2,
  Triplet = 3,
  Sixteenth = 4
}

export interface MetronomeState {
  bpm: number;
  isPlaying: boolean;
  beatsPerBar: number;
  subdivision: Subdivision;
  volume: number; // 0.0 to 1.0
}

export interface BeatEvent {
  beat: number;     // 0-indexed beat in the bar
  subBeat: number;  // 0-indexed sub-beat within the beat
  time: number;     // AudioContext time
}