import { ScriptBlock, ScriptElementType } from '@/src/types';

export interface ParsedSlugline {
  setting: 'INT' | 'EXT' | 'INT/EXT';
  location: string;
  timeOfDay: 'DAY' | 'NIGHT' | 'CONTINUOUS' | 'LATER';
}

/**
 * Parses a raw scene heading block text into standard components
 */
export function parseSlugline(text: string): ParsedSlugline {
  const clean = text.trim().toUpperCase();
  let setting: 'INT' | 'EXT' | 'INT/EXT' = 'INT';

  if (clean.startsWith('INT/EXT.') || clean.startsWith('INT/EXT') || clean.startsWith('I/E.')) {
    setting = 'INT/EXT';
  } else if (clean.startsWith('EXT.') || clean.startsWith('EXT')) {
    setting = 'EXT';
  }

  const parts = clean.split('-').map((p) => p.trim());
  let location = parts[0] || 'LOCATION';
  let timeOfDay: 'DAY' | 'NIGHT' | 'CONTINUOUS' | 'LATER' = 'DAY';

  // Strip setting prefix from location
  location = location
    .replace(/^(INT\/EXT\.|INT\/EXT|I\/E\.|INT\.|INT|EXT\.|EXT)\s*/i, '')
    .trim();

  if (parts.length > 1) {
    const timePart = parts[parts.length - 1];
    if (timePart.includes('NIGHT')) timeOfDay = 'NIGHT';
    else if (timePart.includes('CONTINUOUS')) timeOfDay = 'CONTINUOUS';
    else if (timePart.includes('LATER')) timeOfDay = 'LATER';
    else timeOfDay = 'DAY';
  }

  return { setting, location, timeOfDay };
}

/**
 * Extracts unique character names from character blocks
 */
export function extractUniqueCharacters(blocks: ScriptBlock[]): string[] {
  const names = new Set<string>();
  for (const block of blocks) {
    if (block.type === 'character' && block.text.trim()) {
      // Remove V.O. or O.S. parentheticals
      const cleanName = block.text.replace(/\s*\([^)]*\)/g, '').trim().toUpperCase();
      if (cleanName) {
        names.add(cleanName);
      }
    }
  }
  return Array.from(names);
}

/**
 * Determines the smart next element type based on standard screenplay flow rules
 */
export function getNextBlockType(currentType: ScriptElementType): ScriptElementType {
  switch (currentType) {
    case 'scene_heading':
      return 'action';
    case 'character':
      return 'dialogue';
    case 'parenthetical':
      return 'dialogue';
    case 'dialogue':
      return 'action';
    case 'transition':
      return 'scene_heading';
    case 'shot':
      return 'action';
    case 'action':
    default:
      return 'action';
  }
}
