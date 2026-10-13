import React from 'react';
import { Play, Square, FastForward, Volume2 } from 'lucide-react';
import { Button, Badge } from '@/src/components/atoms';

export interface TableReadPlayerWidgetProps {
  isPlaying: boolean;
  activeBlockId: string | null;
  onPlay: () => void;
  onStop: () => void;
}

export const TableReadPlayerWidget: React.FC<TableReadPlayerWidgetProps> = ({
  isPlaying,
  activeBlockId,
  onPlay,
  onStop,
}) => {
  return (
    <div className="flex items-center space-x-3 rounded-xl bg-slate-900 px-3 py-1.5 border border-slate-800 font-mono text-xs select-none">
      <Badge variant={isPlaying ? 'primary' : 'default'} dot={isPlaying}>
        {isPlaying ? 'READING LIVE' : 'TABLE READ'}
      </Badge>

      {isPlaying ? (
        <Button variant="danger" size="sm" onClick={onStop} title="Stop Audio Read">
          <Square className="h-3.5 w-3.5" />
          <span>Stop</span>
        </Button>
      ) : (
        <Button variant="primary" size="sm" onClick={onPlay} title="Start Voice Table Read">
          <Play className="h-3.5 w-3.5" />
          <span>Play Read</span>
        </Button>
      )}
    </div>
  );
};
