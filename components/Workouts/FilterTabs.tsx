import { BlurView } from 'expo-blur';
import { StyleSheet, useColorScheme } from 'react-native';
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
  const dark = useColorScheme() === 'dark';

  return (
    <Container>
      <BlurView
        intensity={24}
        tint={dark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
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
            <TabLabel
              numberOfLines={1}
              isActive={isActive}
              activeColor={theme.colors.primary}
            >
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
  gap: 6px;
  padding: 4px;
  border-radius: 22px;
  overflow: hidden;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.04);
`;

const Tab = styled.Pressable<{ isActive: boolean; activeColor: string }>`
  flex: 1;
  align-items: center;
  padding: 7px 4px;
  border-radius: 18px;
  background-color: ${({ isActive, activeColor }) =>
    isActive ? activeColor : 'transparent'};
`;

const TabLabel = styled.Text<{ isActive: boolean; activeColor: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ isActive, theme }) =>
    isActive ? '#fff' : theme.colors.onSurfaceVariant};
`;
