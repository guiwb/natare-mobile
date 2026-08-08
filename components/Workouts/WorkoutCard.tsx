import { UICard } from '@/components/UI/Card';
import { UISquareIcon } from '@/components/UI/SquareIcon';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {
  formatDatetime,
  formatMeters,
  formatTotalDuration,
  Workout,
} from './types';

const STATUS_COLOR = {
  scheduled: 'default',
  in_progress: 'orange',
  awaiting_confirmation: 'orange',
  completed: 'green',
  missed: 'red',
} as const;

const DOT_COLOR = {
  scheduled: '#4285f4',
  in_progress: '#F97316',
  awaiting_confirmation: '#EAB308',
  completed: '#22C55E',
  missed: '#EF4444',
} as const;

export function WorkoutCard({ workout }: { workout: Workout }) {
  const router = useRouter();
  const { id, name, icon, status, datetime, distance, duration } = workout;
  const isMissed = status === 'missed';
  const [pressed, setPressed] = useState(false);

  // um Tap do gesture-handler falha assim que o dedo desliza, entao arrastar
  // para trocar de semana comecando em cima do card nao abre o detalhe
  const tap = Gesture.Tap()
    .runOnJS(true)
    .maxDistance(12)
    .onBegin(() => setPressed(true))
    .onFinalize(() => setPressed(false))
    .onEnd(() => router.navigate(`/workout/${id}`));

  return (
    <GestureDetector gesture={tap}>
      <PressableCard style={{ opacity: pressed ? 0.75 : 1 }}>
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
          <StatValue strikethrough={isMissed}>{formatMeters(distance)}</StatValue>
          <StatValue strikethrough={isMissed}>
            {formatTotalDuration(duration)}
          </StatValue>
        </StatsColumn>
      </PressableCard>
    </GestureDetector>
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
