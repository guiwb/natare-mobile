import { UIScreen } from '@/components/UI/Screen';
import { UIUserHeader } from '@/components/UI/UserHeader';
import { useNotifications } from '@/contexts/NotificationsProvider';
import { INotification } from '@/services/notifications.service';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import styled from 'styled-components/native';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export default function NotificationsScreen() {
  const { items, unreadCount, loading, refresh, markRead, markAllRead } =
    useNotifications();

  useFocusEffect(
    useCallback(() => {
      void refresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <UIScreen
      header={
        <UIUserHeader
          title="Notificações"
          subtitle={unreadCount > 0 ? `${unreadCount} não lidas` : undefined}
        />
      }
      contentStyle={{ flexGrow: 1 }}
    >
      {unreadCount > 0 && (
        <MarkAll onPress={markAllRead}>
          <MarkAllText>Marcar todas como lidas</MarkAllText>
        </MarkAll>
      )}

      {items.length === 0 ? (
        <Empty>
          <Icon source="bell-outline" size={40} color="#9aa0a6" />
          <EmptyText>
            {loading
              ? 'Carregando...'
              : 'Você não tem notificações por enquanto.'}
          </EmptyText>
        </Empty>
      ) : (
        items.map((item) => (
          <NotificationItem
            key={item.id}
            item={item}
            onPress={() => markRead(item.id)}
          />
        ))
      )}
    </UIScreen>
  );
}

function NotificationItem({
  item,
  onPress,
}: {
  item: INotification;
  onPress: () => void;
}) {
  const unread = !item.read_at;

  return (
    <Card onPress={onPress} unread={unread}>
      <Row>
        {unread && <UnreadDot />}
        <CardTitle unread={unread}>{item.title}</CardTitle>
      </Row>
      {item.body && <CardBody>{item.body}</CardBody>}
      <CardTime>{dayjs(item.created_at).fromNow()}</CardTime>
    </Card>
  );
}

const Card = styled.Pressable<{ unread: boolean }>`
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  gap: 6px;
  background-color: ${({ unread }) =>
    unread ? 'rgba(66, 133, 244, 0.1)' : 'rgba(255, 255, 255, 0.04)'};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const CardTitle = styled(Text)<{ unread: boolean }>`
  font-size: 15px;
  font-weight: ${({ unread }) => (unread ? '700' : '600')};
  color: ${({ theme }) => theme.colors.onSurface};
  flex: 1;
`;

const CardBody = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const CardTime = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const MarkAll = styled(Pressable)`
  align-self: flex-end;
`;

const MarkAllText = styled(Text)`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Empty = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding-top: 80px;
`;

const EmptyText = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;
