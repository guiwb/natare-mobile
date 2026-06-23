import { UIScreen } from '@/components/UI/Screen';
import { UIUserHeader } from '@/components/UI/UserHeader';
import { Icon, Text } from 'react-native-paper';
import styled from 'styled-components/native';

export default function NotificationsScreen() {
  return (
    <UIScreen
      header={<UIUserHeader title="Notificações" />}
      contentStyle={{ flexGrow: 1 }}
    >
      <Empty>
        <Icon source="bell-outline" size={40} color="#9aa0a6" />
        <EmptyText>Você não tem notificações por enquanto.</EmptyText>
      </Empty>
    </UIScreen>
  );
}

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
