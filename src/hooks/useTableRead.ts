import { useState, useCallback } from 'react';
import { ScriptBlock } from '@/src/types';
import { globalTableReadEngine } from '@/src/utils/audio/tableReadEngine';

export function useTableRead(blocks: ScriptBlock[]) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const speakNext = useCallback(
    (idx: number) => {
      if (idx >= blocks.length) {
        setIsPlaying(false);
        setCurrentIndex(-1);
        return;
      }

      setCurrentIndex(idx);
      const targetBlock = blocks[idx];

      globalTableReadEngine.speakBlock(targetBlock, () => {
        speakNext(idx + 1);
      });
    },
    [blocks]
  );

  const startRead = useCallback(() => {
    setIsPlaying(true);
    speakNext(0);
  }, [speakNext]);

  const stopRead = useCallback(() => {
    globalTableReadEngine.stop();
    setIsPlaying(false);
    setCurrentIndex(-1);
  }, []);

  return {
    isPlaying,
    currentIndex,
    activeBlockId: currentIndex >= 0 ? blocks[currentIndex]?.id : null,
    startRead,
    stopRead,
  };
}
