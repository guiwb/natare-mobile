import { UICard } from '@/components/UI/Card';
import { UIMenu } from '@/components/UI/Menu';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Icon, Menu, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const INTENSITY_COLORS = [
  'rgba(66, 133, 244, 0.08)',
  'rgba(66, 133, 244, 0.25)',
  'rgba(66, 133, 244, 0.45)',
  'rgba(66, 133, 244, 0.68)',
  '#4285F4',
];

type DayCell = { day: number | null; level: number };

function buildGrid(
  year: number,
  month: number,
  data: Record<string, number>,
): DayCell[][] {
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: DayCell[] = [
    ...Array.from({ length: firstDow }, () => ({ day: null, level: 0 })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      level: data[`${year}-${month + 1}-${i + 1}`] ?? 0,
    })),
  ];

  while (cells.length % 7 !== 0) cells.push({ day: null, level: 0 });

  return Array.from({ length: cells.length / 7 }, (_, i) =>
    cells.slice(i * 7, i * 7 + 7),
  );
}

function generateMockData(year: number, month: number): Record<string, number> {
  const data: Record<string, number> = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    if (Math.random() > 0.25) {
      data[`${year}-${month + 1}-${d}`] = Math.floor(Math.random() * 5);
    }
  }
  return data;
}

export function ActivityHeatmapCard() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = useTheme();

  const year = today.getFullYear();
  const data = useMemo(
    () => generateMockData(year, selectedMonth),
    [year, selectedMonth],
  );
  const rows = useMemo(
    () => buildGrid(year, selectedMonth, data),
    [year, selectedMonth, data],
  );

  return (
    <StyledCard>
      <HeaderRow>
        <Title>Mapa de atividades</Title>
        <UIMenu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <MonthButton onPress={() => setMenuVisible(true)}>
              <MonthButtonText>{MONTHS[selectedMonth]}</MonthButtonText>
              <Icon
                source="chevron-down"
                size={16}
                color={theme.colors.onSurface}
              />
            </MonthButton>
          }
        >
          {MONTHS.map((month, index) => {
            const selected = index === selectedMonth;
            return (
              <Menu.Item
                key={month}
                dense
                title={month}
                titleStyle={
                  selected
                    ? { color: theme.colors.primary, fontWeight: '700' }
                    : undefined
                }
                trailingIcon={
                  selected
                    ? () => (
                        <Icon
                          source="check"
                          size={18}
                          color={theme.colors.primary}
                        />
                      )
                    : undefined
                }
                onPress={() => {
                  setSelectedMonth(index);
                  setMenuVisible(false);
                }}
              />
            );
          })}
        </UIMenu>
      </HeaderRow>

      <View style={{ gap: 4 }}>
        <DayLabelsRow>
          {DAYS.map((day) => (
            <DayLabel key={day}>{day}</DayLabel>
          ))}
        </DayLabelsRow>

        {rows.map((row, rowIndex) => (
          <WeekRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <Cell
                key={cellIndex}
                color={
                  cell.day !== null
                    ? INTENSITY_COLORS[cell.level]
                    : 'transparent'
                }
              />
            ))}
          </WeekRow>
        ))}
      </View>

      <LegendRow>
        <LegendLabel>Menor volume</LegendLabel>
        {INTENSITY_COLORS.map((color, i) => (
          <LegendCell key={i} color={color} />
        ))}
        <LegendLabel>Maior volume</LegendLabel>
      </LegendRow>
    </StyledCard>
  );
}

const StyledCard = styled(UICard)`
  flex-direction: column;
  gap: 16px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const MonthButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 20px;
  padding: 7px 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outline};
`;

const MonthButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 14px;
`;

const DayLabelsRow = styled.View`
  flex-direction: row;
  gap: 4px;
`;

const DayLabel = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const WeekRow = styled.View`
  flex-direction: row;
  gap: 4px;
`;

const Cell = styled.View<{ color: string }>`
  flex: 1;
  height: 16px;
  border-radius: 6px;
  background-color: ${({ color }) => color};
`;

const LegendRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
`;

const LegendLabel = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
  margin: 0 4px;
`;

const LegendCell = styled.View<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
`;
