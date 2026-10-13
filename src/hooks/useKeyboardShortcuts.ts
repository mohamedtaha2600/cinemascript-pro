import { useEffect } from 'react';
import { KEYBOARD_SHORTCUTS } from '@/src/constants/keyboardShortcuts';

export interface ShortcutHandlers {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onNewScene?: () => void;
  onToggleAi?: () => void;
  onCloseModal?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd && e.key.toLowerCase() === KEYBOARD_SHORTCUTS.SAVE_PROJECT.key) {
        e.preventDefault();
        handlers.onSave?.();
      } else if (isCtrlOrCmd && e.key.toLowerCase() === KEYBOARD_SHORTCUTS.UNDO.key && !e.shiftKey) {
        e.preventDefault();
        handlers.onUndo?.();
      } else if ((isCtrlOrCmd && e.key.toLowerCase() === KEYBOARD_SHORTCUTS.REDO.key) || (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        handlers.onRedo?.();
      } else if (isCtrlOrCmd && e.altKey && e.key.toLowerCase() === KEYBOARD_SHORTCUTS.NEW_SCENE.key) {
        e.preventDefault();
        handlers.onNewScene?.();
      } else if (isCtrlOrCmd && e.key.toLowerCase() === KEYBOARD_SHORTCUTS.TOGGLE_AI_ASSISTANT.key) {
        e.preventDefault();
        handlers.onToggleAi?.();
      } else if (e.key === KEYBOARD_SHORTCUTS.CLOSE_MODAL.key) {
        handlers.onCloseModal?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
