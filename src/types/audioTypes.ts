export interface VoiceCharacterMapping {
  characterName: string;
  voiceURI?: string;
  pitch: number;
  rate: number;
  genderPref?: 'male' | 'female' | 'neutral';
}

export interface TableReadState {
  isPlaying: boolean;
  isPaused: boolean;
  currentBlockId: string | null;
  playbackRate: number;
  volume: number;
  activeCharacter: string | null;
}
