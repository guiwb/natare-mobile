import { registerForPushNotifications } from '@/lib/notifications';
import NotificationsService, {
  INotification,
} from '@/services/notifications.service';
import * as Notifications from 'expo-notifications';
import { setItemAsync } from 'expo-secure-store';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';
import { useAuth } from './AuthProvider';
import { useSnackbar } from './SnackbarProvider';

const PAGE_SIZE = 50;

interface NotificationsContextType {
  items: INotification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | null>(
  null,
);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      'useNotifications deve ser usado dentro do NotificationsProvider',
    );
  }

  return context;
};

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const { snack } = useSnackbar();
  const [items, setItems] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const registered = useRef(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const [list, count] = await Promise.all([
        NotificationsService.list(0, PAGE_SIZE),
        NotificationsService.unreadCount(),
      ]);
      setItems(list.items);
      setUnreadCount(count);
    } catch {
      snack('Não foi possível carregar suas notificações.');
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target || target.read_at) return;

    try {
      await NotificationsService.markRead(id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, read_at: new Date().toISOString() }
            : item,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      snack('Não foi possível marcar a notificação como lida.');
    }
  };

  const markAllRead = async () => {
    try {
      await NotificationsService.markAllRead();
      const now = new Date().toISOString();
      setItems((prev) =>
        prev.map((item) => (item.read_at ? item : { ...item, read_at: now })),
      );
      setUnreadCount(0);
    } catch {
      snack('Não foi possível marcar as notificações como lidas.');
    }
  };

  const registerPush = async () => {
    if (registered.current) return;
    registered.current = true;

    try {
      const token = await registerForPushNotifications();
      if (!token) return;

      await NotificationsService.registerToken(
        token,
        Platform.OS === 'ios' ? 'ios' : 'android',
      );
      await setItemAsync('pushToken', token);
    } catch (error) {
      console.warn('Falha ao registrar push token:', error);
      snack('Não foi possível ativar as notificações push neste dispositivo.');
    }
  };

  useEffect(() => {
    if (!user) {
      registered.current = false;
      setItems([]);
      setUnreadCount(0);
      return;
    }

    void registerPush();
    void refresh();

    const received = Notifications.addNotificationReceivedListener(() => {
      void refresh();
    });
    const responded = Notifications.addNotificationResponseReceivedListener(
      () => {
        void refresh();
      },
    );

    return () => {
      received.remove();
      responded.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <NotificationsContext.Provider
      value={{ items, unreadCount, loading, refresh, markRead, markAllRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
