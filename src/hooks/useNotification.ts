import { useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  durationMs?: number;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    ({ type = 'info', title, message, durationMs = 4000 }: Omit<NotificationItem, 'id'>) => {
      const id = 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
      const newNotif: NotificationItem = { id, type, title, message, durationMs };

      setNotifications((prev) => [...prev, newNotif]);

      if (durationMs > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, durationMs);
      }
    },
    [removeNotification]
  );

  return {
    notifications,
    notify,
    removeNotification,
  };
}
