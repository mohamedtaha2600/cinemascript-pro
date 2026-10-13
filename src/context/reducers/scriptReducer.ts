import { ScriptBlock } from '@/src/types';
import { ScriptAction } from '../types/projectStateTypes';

export function scriptReducer(state: ScriptBlock[], action: ScriptAction): ScriptBlock[] {
  switch (action.type) {
    case 'SET_SCRIPT_BLOCKS':
      return action.payload;

    case 'ADD_SCRIPT_BLOCK':
      return [...state, action.payload];

    case 'INSERT_SCRIPT_BLOCK_AT_INDEX': {
      const { blockType, character, text, index } = action.payload;
      const newBlock: ScriptBlock = {
        id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: blockType,
        text,
        characterName: character || undefined,
      };

      const blocks = [...state];
      if (typeof index === 'number' && index >= 0 && index <= blocks.length) {
        blocks.splice(index, 0, newBlock);
      } else {
        blocks.push(newBlock);
      }
      return blocks;
    }

    case 'DELETE_PAGE': {
      // Deletes blocks associated with a specific page layout
      const { pageNumber } = action.payload;
      const blocksPerPage = 8;
      const startIndex = (pageNumber - 1) * blocksPerPage;
      return state.filter((_, idx) => idx < startIndex || idx >= startIndex + blocksPerPage);
    }

    case 'DELETE_SCENE': {
      const { sceneNumberOrId } = action.payload;
      let sceneHeadingIndex = -1;

      if (typeof sceneNumberOrId === 'number') {
        let count = 0;
        sceneHeadingIndex = state.findIndex((b) => {
          if (b.type === 'scene_heading') {
            count++;
            return count === sceneNumberOrId;
          }
          return false;
        });
      } else {
        sceneHeadingIndex = state.findIndex((b) => b.id === sceneNumberOrId);
      }

      if (sceneHeadingIndex === -1) return state;

      // Find next scene heading index or end of script
      let nextHeadingIndex = state.findIndex(
        (b, idx) => idx > sceneHeadingIndex && b.type === 'scene_heading'
      );
      if (nextHeadingIndex === -1) nextHeadingIndex = state.length;

      return state.filter((_, idx) => idx < sceneHeadingIndex || idx >= nextHeadingIndex);
    }

    case 'MOVE_SCENE': {
      const { sceneNumber, direction } = action.payload;
      // Extract scenes and reorder scene block groups
      const sceneIndices: number[] = [];
      state.forEach((b, idx) => {
        if (b.type === 'scene_heading') sceneIndices.push(idx);
      });

      const sceneIdxInList = sceneNumber - 1;
      const targetIdxInList = direction === 'up' ? sceneIdxInList - 1 : sceneIdxInList + 1;

      if (
        sceneIdxInList < 0 ||
        sceneIdxInList >= sceneIndices.length ||
        targetIdxInList < 0 ||
        targetIdxInList >= sceneIndices.length
      ) {
        return state;
      }

      // Collect block ranges for each scene
      const getSceneRange = (sIdx: number) => {
        const start = sceneIndices[sIdx];
        const end = sIdx + 1 < sceneIndices.length ? sceneIndices[sIdx + 1] : state.length;
        return state.slice(start, end);
      };

      const currentSceneBlocks = getSceneRange(sceneIdxInList);
      const targetSceneBlocks = getSceneRange(targetIdxInList);

      const beforeAll = state.slice(0, Math.min(sceneIndices[sceneIdxInList], sceneIndices[targetIdxInList]));
      const afterAll = state.slice(
        Math.max(
          sceneIdxInList + 1 < sceneIndices.length ? sceneIndices[sceneIdxInList + 1] : state.length,
          targetIdxInList + 1 < sceneIndices.length ? sceneIndices[targetIdxInList + 1] : state.length
        )
      );

      if (direction === 'up') {
        return [...beforeAll, ...currentSceneBlocks, ...targetSceneBlocks, ...afterAll];
      } else {
        return [...beforeAll, ...targetSceneBlocks, ...currentSceneBlocks, ...afterAll];
      }
    }

    case 'REWRITE_SCENE_BLOCK': {
      const { blockIdOrSceneNumber, newText } = action.payload;
      return state.map((b) => {
        if (b.id === blockIdOrSceneNumber || b.sceneNumber === blockIdOrSceneNumber) {
          return { ...b, text: newText };
        }
        return b;
      });
    }

    case 'HIGHLIGHT_SCRIPT_RANGE': {
      const { startLine, endLine } = action.payload;
      return state.map((b, idx) => {
        const lineNum = idx + 1;
        if (lineNum >= startLine && lineNum <= endLine) {
          return { ...b, highlight: true };
        }
        return b;
      });
    }

    default:
      return state;
  }
}
