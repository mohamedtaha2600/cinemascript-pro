import { ScriptBlock } from '@/src/types';
import { HOLLYWOOD_SCREENPLAY_CONSTRAINTS } from '@/src/mcp/storyEngineRules';

export interface ValidationIssue {
  blockId: string;
  type: 'error' | 'warning';
  message: string;
}

export function validateScreenplayBlocks(blocks: ScriptBlock[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  blocks.forEach((b) => {
    if (!b.text.trim()) {
      issues.push({
        blockId: b.id,
        type: 'warning',
        message: `Empty block detected for type: ${b.type}`,
      });
    }

    if (b.type === 'scene_heading' && !HOLLYWOOD_SCREENPLAY_CONSTRAINTS.validateSceneHeading(b.text)) {
      issues.push({
        blockId: b.id,
        type: 'error',
        message: 'Scene heading must start with INT., EXT., or INT/EXT.',
      });
    }
  });

  return issues;
}
