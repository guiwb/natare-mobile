import { http } from '@/lib/http/axios';

export interface INotification {
  id: string;
  type: string | null;
  title: string | null;
  body: string | null;
  data: Record<string, any>;
  read_at: string | null;
  created_at: string;
}

export interface INotificationsList {
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
  items: INotification[];
}

type TPlatform = 'ios' | 'android';

export default class NotificationsService {
  static registerToken(token: string, platform: TPlatform): Promise<void> {
    return http.post('/api/push-tokens', { token, platform });
  }

  static removeToken(token: string): Promise<void> {
    return http.delete('/api/push-tokens', { data: { token } });
  }

  static async list(
    offset: number,
    limit: number,
  ): Promise<INotificationsList> {
    const { data } = await http.get(
      `/api/notifications?offset=${offset}&limit=${limit}`,
    );
    return data;
  }

  static async unreadCount(): Promise<number> {
    const { data } = await http.get('/api/notifications/unread-count');
    return data.count;
  }

  static markRead(id: string): Promise<void> {
    return http.patch(`/api/notifications/${id}/read`);
  }

  static markAllRead(): Promise<void> {
    return http.post('/api/notifications/read-all');
  }
}
