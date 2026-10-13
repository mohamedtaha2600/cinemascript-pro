import React from 'react';
import { LocationItem } from '@/src/types';
import { MapPin, Sun } from 'lucide-react';

export interface LocationCardGridProps {
  locations: LocationItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const LocationCardGrid: React.FC<LocationCardGridProps> = ({
  locations,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="space-y-2 p-3">
      {locations.map((loc) => (
        <div
          key={loc.id}
          onClick={() => onSelect(loc.id)}
          className={`flex items-center space-x-3 rounded-lg p-3 cursor-pointer transition-all border ${
            selectedId === loc.id
              ? 'bg-blue-500/10 border-blue-500/40 text-slate-100 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-blue-400 border border-slate-700">
            <MapPin className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm truncate">{loc.name}</h4>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-blue-400 border border-slate-700">
                {loc.type}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-slate-500 mt-0.5">
              <Sun className="h-3 w-3 text-amber-400" />
              <span>{loc.timeOfDay}</span>
            </div>
          </div>
        </div>
      ))}

      {locations.length === 0 && (
        <div className="p-8 text-center text-xs text-slate-500 font-mono">
          <MapPin className="h-6 w-6 mx-auto mb-2 text-slate-600" />
          No locations registered yet. Click + to add.
        </div>
      )}
    </div>
  );
};
