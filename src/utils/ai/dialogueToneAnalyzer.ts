import { ScriptBlock } from '@/src/types';

export interface ToneAnalysisResult {
  dominantEmotion: 'Intense' | 'Melancholic' | 'Humorous' | 'Sarcastic' | 'Neutral';
  tensionScore: number; // 0 - 100
  subtextHint: string;
}

export function analyzeDialogueTone(blocks: ScriptBlock[]): ToneAnalysisResult {
  let textLength = 0;
  let exclamations = 0;

  blocks.forEach((b) => {
    if (b.type === 'dialogue') {
      textLength += b.text.length;
      if (b.text.includes('!')) exclamations++;
    }
  });

  const tensionScore = Math.min(100, Math.round((exclamations * 20) + (textLength > 300 ? 40 : 20)));

  return {
    dominantEmotion: tensionScore > 60 ? 'Intense' : tensionScore > 30 ? 'Sarcastic' : 'Neutral',
    tensionScore,
    subtextHint: tensionScore > 60 ? 'High conflict & emotional stakes.' : 'Subtle character dynamic.',
  };
}
