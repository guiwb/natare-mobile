import { useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

export type WorkoutFilter = 'all' | 'scheduled' | 'completed' | 'missed';

const FILTERS: { key: WorkoutFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'scheduled', label: 'Agendados' },
  { key: 'completed', label: 'Concluídos' },
  { key: 'missed', label: 'Perdidos' },
];

export function FilterTabs({
  active,
  onChange,
}: {
  active: WorkoutFilter;
  onChange: (filter: WorkoutFilter) => void;
}) {
  const theme = useTheme();

  return (
    <Container>
      {FILTERS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <Tab
            key={key}
            onPress={() => onChange(key)}
            isActive={isActive}
            activeColor={theme.colors.primary}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <TabLabel isActive={isActive} activeColor={theme.colors.primary}>
              {label}
            </TabLabel>
          </Tab>
        );
      })}
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const Tab = styled.Pressable<{ isActive: boolean; activeColor: string }>`
  padding: 6px 14px;
  border-radius: 20px;
  background-color: ${({ isActive, activeColor, theme }) =>
    isActive ? activeColor : theme.colors.surfaceVariant};
`;

const TabLabel = styled.Text<{ isActive: boolean; activeColor: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ isActive, theme }) =>
    isActive ? '#fff' : theme.colors.onSurfaceVariant};
`;
