import { ScriptBlock } from '@/src/types';

export interface PageSplit {
  pageNumber: number;
  blocks: ScriptBlock[];
}

export interface ScreenplayMetrics {
  wordsCount: number;
  charactersCount: number;
  scenesCount: number;
  pagesCount: number;
  estimatedRuntimeMinutes: number;
}

/**
 * Calculates page breaks for standard screenplay formatting.
 * A standard page has approximately 52-54 lines.
 */
export function calculatePages(blocks: ScriptBlock[]): PageSplit[] {
  if (!blocks || blocks.length === 0) {
    return [{ pageNumber: 1, blocks: [] }];
  }

  const LINES_PER_PAGE = 52;
  const pages: PageSplit[] = [];
  let currentPageBlocks: ScriptBlock[] = [];
  let currentLines = 0;

  for (const block of blocks) {
    let blockLines = 1;
    const textLen = block.text.length;

    switch (block.type) {
      case 'scene_heading':
        blockLines = 3;
        break;
      case 'character':
        blockLines = 2;
        break;
      case 'parenthetical':
        blockLines = Math.max(1, Math.ceil(textLen / 35));
        break;
      case 'dialogue':
        blockLines = Math.max(1, Math.ceil(textLen / 38)) + 1;
        break;
      case 'transition':
      case 'shot':
        blockLines = 2;
        break;
      case 'action':
      default:
        blockLines = Math.max(1, Math.ceil(textLen / 62)) + 1;
        break;
    }

    if (currentLines + blockLines > LINES_PER_PAGE && currentPageBlocks.length > 0) {
      pages.push({
        pageNumber: pages.length + 1,
        blocks: currentPageBlocks,
      });
      currentPageBlocks = [block];
      currentLines = blockLines;
    } else {
      currentPageBlocks.push(block);
      currentLines += blockLines;
    }
  }

  if (currentPageBlocks.length > 0) {
    pages.push({
      pageNumber: pages.length + 1,
      blocks: currentPageBlocks,
    });
  }

  return pages;
}

/**
 * Calculates comprehensive screenplay metrics (words, chars, scenes, pages, runtime)
 */
export function computeScreenplayMetrics(blocks: ScriptBlock[]): ScreenplayMetrics {
  let wordsCount = 0;
  let charactersCount = 0;
  let scenesCount = 0;

  for (const block of blocks) {
    const text = block.text || '';
    charactersCount += text.length;
    wordsCount += text.trim() ? text.trim().split(/\s+/).length : 0;
    if (block.type === 'scene_heading') {
      scenesCount++;
    }
  }

  const pages = calculatePages(blocks);
  const pagesCount = pages.length;
  const estimatedRuntimeMinutes = pagesCount; // Standard 1 page = 1 minute

  return {
    wordsCount,
    charactersCount,
    scenesCount,
    pagesCount,
    estimatedRuntimeMinutes,
  };
}
