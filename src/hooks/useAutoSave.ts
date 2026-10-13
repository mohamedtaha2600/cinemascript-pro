import { useEffect, useRef, useState } from 'react';

export interface UseAutoSaveOptions<T> {
  key: string;
  data: T;
  debounceMs?: number;
  onSaveSuccess?: () => void;
  onSaveError?: (error: unknown) => void;
}

export function useAutoSave<T>({
  key,
  data,
  debounceMs = 400,
  onSaveSuccess,
  onSaveError,
}: UseAutoSaveOptions<T>) {
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(key, serialized);
        const timestamp = new Date().toLocaleTimeString();
        setLastSavedTime(timestamp);
        onSaveSuccess?.();
      } catch (err) {
        console.error('AutoSave failed:', err);
        onSaveError?.(err);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [key, data, debounceMs, onSaveSuccess, onSaveError]);

  return { lastSavedTime };
}
