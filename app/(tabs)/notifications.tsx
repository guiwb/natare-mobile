import { UIScreen } from '@/components/UI/Screen';
import { Icon, Text } from 'react-native-paper';
import styled from 'styled-components/native';

export default function NotificationsScreen() {
  return (
    <UIScreen
      header={<Title>Notificações</Title>}
      contentStyle={{ flexGrow: 1 }}
    >
      <Empty>
        <Icon source="bell-outline" size={40} color="#9aa0a6" />
        <EmptyText>Você não tem notificações por enquanto.</EmptyText>
      </Empty>
    </UIScreen>
  );
}

const Title = styled(Text)`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
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
