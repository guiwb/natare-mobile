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
  onReset,
}: {
  offset: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
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

      <LabelGroup>
        <Label>{getWeekLabel(offset)}</Label>
        {offset !== 0 && (
          <ResetButton onPress={onReset}>
            <Icon
              source="calendar-arrow-left"
              size={14}
              color={theme.colors.primary}
            />
            <ResetText>Voltar à semana atual</ResetText>
          </ResetButton>
        )}
      </LabelGroup>

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

const LabelGroup = styled.View`
  flex: 1;
  align-items: center;
  gap: 6px;
`;

const ResetButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.primaryContainer};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const ResetText = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Label = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const NavButton = styled.Pressable`
  padding: 8px;
`;
