import { ScriptElementType } from '@/src/types';

export interface EpisodeOutline {
  episodeNumber: number;
  title: string;
  logline: string;
  actBreakdown: {
    act1Summary: string;
    act2Summary: string;
    act3Summary: string;
  };
  keyCharacters: string[];
  locations: string[];
  estimatedPages: number;
}

export interface SeriesBibleBlueprint {
  seriesTitle: string;
  genre: string;
  premise: string;
  totalEpisodes: number;
  episodes: EpisodeOutline[];
  characterRoster: Array<{
    name: string;
    role: string;
    archetype: string;
    bio: string;
    traits: string[];
  }>;
  locationCatalog: Array<{
    name: string;
    type: 'INT' | 'EXT';
    description: string;
    timeOfDay: string;
  }>;
}

export interface GenerationProgress {
  status: 'idle' | 'generating_bible' | 'generating_outlines' | 'writing_screenplay' | 'generating_breakdown' | 'completed' | 'failed';
  currentEpisode: number;
  totalEpisodes: number;
  currentScene: number;
  totalScenesWritten: number;
  totalPagesGenerated: number;
  activeTaskMessage: string;
  error?: string;
}
