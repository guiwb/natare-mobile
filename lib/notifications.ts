import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

type NotificationsModule = typeof import('expo-notifications');

/**
 * Expo Go dropped remote notifications in SDK 53 and since SDK 57 importing
 * `expo-notifications` there throws, which would take down every module that
 * imports this file (the tabs layout included). The native module is only
 * loaded in builds that actually support it.
 */
export const pushAvailable =
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

let notifications: NotificationsModule | null = null;

function getNotifications(): NotificationsModule | null {
  if (!pushAvailable) return null;

  if (!notifications) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    notifications = require('expo-notifications') as NotificationsModule;
    notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  return notifications;
}

/** Subscribes to incoming notifications. Returns the unsubscribe function. */
export function addNotificationListeners(onEvent: () => void): () => void {
  const Notifications = getNotifications();
  if (!Notifications) return () => {};

  const received = Notifications.addNotificationReceivedListener(onEvent);
  const responded =
    Notifications.addNotificationResponseReceivedListener(onEvent);

  return () => {
    received.remove();
    responded.remove();
  };
}

export async function registerForPushNotifications(): Promise<string | null> {
  const Notifications = getNotifications();
  if (!Notifications) return null;

  if (!Device.isDevice) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;

  if (existing !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== 'granted') return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) return null;

  const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  return data;
}
