import { UICard } from '@/components/UI/Card';
import { UISquareIcon } from '@/components/UI/SquareIcon';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import styled from 'styled-components/native';
import { Workout } from './mockData';

const STATUS_COLOR = {
  scheduled: 'default',
  completed: 'green',
  missed: 'red',
} as const;

const DOT_COLOR = {
  scheduled: '#4285f4',
  completed: '#22C55E',
  missed: '#EF4444',
} as const;

function formatDatetime(date: Date): string {
  dayjs.locale('pt-br');
  const d = dayjs(date);
  const today = dayjs().startOf('day');

  if (d.isSame(today, 'day')) return `Hoje às ${d.format('hh:mm')}`;
  if (d.isSame(today.add(1, 'day'), 'day'))
    return `Amanhã às ${d.format('hh:mm')}`;
  if (d.isSame(today.subtract(1, 'day'), 'day'))
    return `Ontem às ${d.format('hh:mm')}`;
  return d.format('ddd, D [de] MMMM [às] hh:mm');
}

export function WorkoutCard({ workout }: { workout: Workout }) {
  const { name, icon, status, datetime, distance, duration } = workout;
  const isMissed = status === 'missed';

  return (
    <PressableCard
      style={({ pressed }) => ({
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <UISquareIcon
        icon={icon}
        size={44}
        iconSize={22}
        color={STATUS_COLOR[status]}
        bgOpacity={20}
      />

      <InfoColumn>
        <NameRow>
          <WorkoutName>{name}</WorkoutName>
          <StatusDot color={DOT_COLOR[status]} />
        </NameRow>
        <DateText>{formatDatetime(datetime)}</DateText>
      </InfoColumn>

      <StatsColumn>
        <StatValue strikethrough={isMissed}>
          {distance != null ? `${distance} km` : '--'}
        </StatValue>
        <StatValue strikethrough={isMissed}>{duration} min</StatValue>
      </StatsColumn>
    </PressableCard>
  );
}

const PressableCard = styled(UICard)`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const InfoColumn = styled.View`
  flex: 1;
  gap: 4px;
`;

const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const WorkoutName = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const StatusDot = styled.View<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
`;

const DateText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const StatsColumn = styled.View`
  align-items: flex-end;
  gap: 4px;
`;

const StatValue = styled.Text<{ strikethrough: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, strikethrough }) =>
    strikethrough ? theme.colors.onSurfaceVariant : theme.colors.onSurface};
  text-decoration-line: ${({ strikethrough }) =>
    strikethrough ? 'line-through' : 'none'};
`;
