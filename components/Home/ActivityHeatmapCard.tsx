import { UICard } from '@/components/UI/Card';
import { UIMenu } from '@/components/UI/Menu';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import HomeService, { IHeatmapDay } from '@/services/home.service';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { ActivityIndicator, Icon, Menu, useTheme } from 'react-native-paper';
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

/**
 * Level 0 is a day without any completion. The rest are quartiles over the
 * highest daily distance of the month itself, so the scale is relative to the
 * displayed month. Dates arrive as `YYYY-MM-DD` already in the company
 * timezone and are read as text, without `new Date()`, which would reinterpret
 * them as UTC and shift the cell.
 */
function levelsFromDays(days: IHeatmapDay[]): Record<string, number> {
  const max = Math.max(...days.map((d) => d.distance), 0);
  if (!max) return {};

  return days.reduce<Record<string, number>>((acc, day) => {
    const [year, month, dayOfMonth] = day.date.split('-').map(Number);
    const level = Math.min(Math.ceil((day.distance / max) * 4), 4);
    acc[`${year}-${month}-${dayOfMonth}`] = Math.max(level, 1);
    return acc;
  }, {});
}

export function ActivityHeatmapCard() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [menuVisible, setMenuVisible] = useState(false);
  const [days, setDays] = useState<IHeatmapDay[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { snack } = useSnackbar();

  const year = today.getFullYear();

  // `silent` refetches without swapping the grid for the spinner, used by
  // refresh and completion
  const fetchHeatmap = useCallback(
    (silent = false) => {
      let active = true;
      const month = `${year}-${String(selectedMonth + 1).padStart(2, '0')}`;
      if (!silent) setLoading(true);

      HomeService.heatmap({ month })
        .then((res) => {
          if (active) setDays(res.days);
        })
        .catch(() => {
          if (active) {
            setDays([]);
            snack('Erro ao carregar o mapa de atividades');
          }
        })
        .finally(() => {
          if (active && !silent) setLoading(false);
        });

      return () => {
        active = false;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [year, selectedMonth],
  );

  useEffect(() => fetchHeatmap(), [fetchHeatmap]);

  useEffect(() => {
    const refetch = () => fetchHeatmap(true);
    const listeners = [
      DeviceEventEmitter.addListener('workoutCompletionChanged', refetch),
      DeviceEventEmitter.addListener('homeRefresh', refetch),
    ];
    return () => listeners.forEach((listener) => listener.remove());
  }, [fetchHeatmap]);

  const data = useMemo(() => levelsFromDays(days), [days]);
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

      {loading ? (
        <GridLoading rows={rows.length}>
          <ActivityIndicator />
        </GridLoading>
      ) : (
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
      )}

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
  gap: 12px;
  padding: 16px;
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

const GridLoading = styled.View<{ rows: number }>`
  height: ${({ rows }) => rows * 18 + 20}px;
  align-items: center;
  justify-content: center;
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
  height: 14px;
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
