export type NotificationCategory = 'trade' | 'market' | 'ai' | 'news' | 'portfolio';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: NotificationPriority;
}
