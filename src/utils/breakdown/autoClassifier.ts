import { ScriptBlock } from '@/src/types';

export interface BreakdownClassification {
  characters: string[];
  props: string[];
  wardrobe: string[];
}

export function autoClassifySceneContent(blocks: ScriptBlock[]): BreakdownClassification {
  const characters = new Set<string>();
  const props = new Set<string>();
  const wardrobe = new Set<string>();

  blocks.forEach((b) => {
    if (b.type === 'character' && b.text.trim()) {
      characters.add(b.text.trim().toUpperCase());
    }

    if (b.type === 'action') {
      const lower = b.text.toLowerCase();
      if (lower.includes('phone') || lower.includes('gun') || lower.includes('key') || lower.includes('bag')) {
        props.add('Key Prop Item');
      }
      if (lower.includes('suit') || lower.includes('coat') || lower.includes('jacket') || lower.includes('dress')) {
        wardrobe.add('Scene Wardrobe');
      }
    }
  });

  return {
    characters: Array.from(characters),
    props: Array.from(props),
    wardrobe: Array.from(wardrobe),
  };
}
