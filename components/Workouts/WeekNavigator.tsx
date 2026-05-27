import { Icon, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

function getWeekLabel(offset: number): string {
  if (offset === 0) return 'Esta semana';
  if (offset === -1) return 'Semana passada';
  if (offset === 1) return 'Próxima semana';
  if (offset < -1) return `${Math.abs(offset)} semanas atrás`;
  return `Em ${offset} semanas`;
}

export function WeekNavigator({
  offset,
  onPrev,
  onNext,
}: {
  offset: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const theme = useTheme();

  return (
    <Container>
      <NavButton onPress={onPrev}>
        <Icon
          source="chevron-left"
          size={22}
          color={theme.colors.onSurfaceVariant}
        />
      </NavButton>

      <Label>{getWeekLabel(offset)}</Label>

      <NavButton onPress={onNext}>
        <Icon
          source="chevron-right"
          size={22}
          color={theme.colors.onSurfaceVariant}
        />
      </NavButton>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const NavButton = styled.Pressable`
  padding: 8px;
`;
