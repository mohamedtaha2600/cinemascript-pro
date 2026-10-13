import { useState, useCallback } from 'react';

export interface UseUndoRedoReturn<T> {
  state: T;
  set: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (initialState: T) => void;
}

export function useUndoRedo<T>(initialPresent: T, maxHistoryLength = 50): UseUndoRedoReturn<T> {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initialPresent);
  const [future, setFuture] = useState<T[]>([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setFuture([present, ...future]);
    setPresent(previous);
  }, [canUndo, past, present, future]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast([...past, present]);
    setPresent(next);
    setFuture(newFuture);
  }, [canRedo, future, past, present]);

  const set = useCallback((newState: T) => {
    setPast((prevPast) => {
      const updatedPast = [...prevPast, present];
      if (updatedPast.length > maxHistoryLength) {
        return updatedPast.slice(updatedPast.length - maxHistoryLength);
      }
      return updatedPast;
    });
    setPresent(newState);
    setFuture([]);
  }, [present, maxHistoryLength]);

  const reset = useCallback((initialState: T) => {
    setPast([]);
    setPresent(initialState);
    setFuture([]);
  }, []);

  return {
    state: present,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
}
