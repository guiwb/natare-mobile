import { Icon, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

export function StatTile({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  const theme = useTheme();

  return (
    <Container>
      <IconBadge>
        <Icon source={icon} size={14} color={theme.colors.primary} />
      </IconBadge>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  gap: 6px;
  padding: 12px;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outline};
  background-color: rgba(255, 255, 255, 0.03);
`;

const IconBadge = styled.View`
  width: 26px;
  height: 26px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primaryContainer};
`;

const Label = styled.Text`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const Value = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;
