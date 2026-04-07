"use client";

export interface TicTacNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'BOARD_INVITE' | 'TASK_MOVED' | 'SYSTEM';
  boardId?: string;
}

/**
 * Pushes a notification to a specific user (localized to localStorage)
 */
export const pushNotification = (userName: string, notification: Omit<TicTacNotification, 'id' | 'timestamp' | 'isRead'>) => {
  if (typeof window === 'undefined') return;

  const key = `tictac_notifications_${userName.toLowerCase()}`;
  const existingRaw = localStorage.getItem(key);
  const notifications: TicTacNotification[] = existingRaw ? JSON.parse(existingRaw) : [];

  const newNotification: TicTacNotification = {
    ...notification,
    id: `nt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    isRead: false
  };

  notifications.unshift(newNotification);
  localStorage.setItem(key, JSON.stringify(notifications.slice(0, 50))); // Keep last 50
  
  // Trigger a custom event so other components can listen for updates
  window.dispatchEvent(new CustomEvent('tictac_new_notification', { detail: { userName } }));
};

/**
 * Gets notifications for a user
 */
export const getNotifications = (userName: string): TicTacNotification[] => {
  if (typeof window === 'undefined') return [];
  const key = `tictac_notifications_${userName.toLowerCase()}`;
  const existingRaw = localStorage.getItem(key);
  return existingRaw ? JSON.parse(existingRaw) : [];
};

/**
 * Marks all as read
 */
export const markAllAsRead = (userName: string) => {
  if (typeof window === 'undefined') return;
  const key = `tictac_notifications_${userName.toLowerCase()}`;
  const notifications = getNotifications(userName);
  const updated = notifications.map(n => ({ ...n, isRead: true }));
  localStorage.setItem(key, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('tictac_new_notification', { detail: { userName } }));
};
