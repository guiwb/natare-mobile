import { UIButton } from '@/components/UI/Button';
import { UIScreen } from '@/components/UI/Screen';
import { UISquareIcon } from '@/components/UI/SquareIcon';
import { SectionCard, sectionStats } from '@/components/Workouts/SectionCard';
import { StatTile } from '@/components/Workouts/StatTile';
import {
  formatDatetime,
  formatMeters,
  formatTotalDuration,
  iconForVolume,
} from '@/components/Workouts/types';
import { WORKOUT_STATUS_LABELS } from '@/constants/workout';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import WorkoutService, { IWorkout } from '@/services/workout.service';
import { isAxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { ActivityIndicator, Icon, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

function isNotStartedError(error: unknown): boolean {
  return (
    isAxiosError(error) &&
    error.response?.data?.message === 'WORKOUT_NOT_STARTED'
  );
}

const STATUS_TONE = {
  scheduled: { color: '#4285f4', icon: 'calendar-clock', square: 'default' },
  in_progress: { color: '#F97316', icon: 'progress-clock', square: 'orange' },
  awaiting_confirmation: {
    color: '#EAB308',
    icon: 'clock-alert-outline',
    square: 'orange',
  },
  completed: { color: '#22C55E', icon: 'check-circle', square: 'green' },
  missed: { color: '#EF4444', icon: 'close-circle', square: 'red' },
} as const;

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { snack } = useSnackbar();
  const [workout, setWorkout] = useState<IWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    WorkoutService.get(id)
      .then((data) => {
        if (active) setWorkout(data);
      })
      .catch(() => {
        if (!active) return;
        snack('Erro ao carregar o treino');
        router.back();
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const sections = useMemo(
    () => [...(workout?.sections ?? [])].sort((a, b) => a.position - b.position),
    [workout],
  );

  const restSeconds = useMemo(
    () => sections.reduce((acc, section) => acc + sectionStats(section).rest, 0),
    [sections],
  );

  const isCompleted = workout?.status === 'completed';
  const hasStarted = workout
    ? new Date(workout.scheduled_at).getTime() <= Date.now()
    : false;
  const canToggle = isCompleted || hasStarted;

  const toggleCompletion = async () => {
    if (!workout) return;

    try {
      setToggling(true);
      const updated = isCompleted
        ? await WorkoutService.uncomplete(workout.id)
        : await WorkoutService.complete(workout.id);

      setWorkout((current) =>
        current
          ? {
              ...current,
              status: updated.status,
              completed_at: updated.completed_at,
              completions_count: updated.completions_count,
            }
          : current,
      );

      DeviceEventEmitter.emit('workoutCompletionChanged');
    } catch (error) {
      snack(
        isNotStartedError(error)
          ? 'O treino ainda não começou'
          : 'Erro ao atualizar a conclusão do treino',
      );
    } finally {
      setToggling(false);
    }
  };

  const header = (
    <HeaderRow>
      <BackButton onPress={() => router.back()}>
        <Icon source="arrow-left" size={22} color={theme.colors.onSurface} />
      </BackButton>
      <ScreenTitle numberOfLines={1}>
        {workout?.name ?? 'Detalhes do treino'}
      </ScreenTitle>
    </HeaderRow>
  );

  if (loading || !workout) {
    return (
      <UIScreen header={header} contentStyle={{ flexGrow: 1 }}>
        <Loading>
          <ActivityIndicator />
        </Loading>
      </UIScreen>
    );
  }

  const tone = STATUS_TONE[workout.status];
  const distance = workout.total_distance ?? 0;
  const duration = workout.total_duration ?? 0;

  return (
    <UIScreen header={header} contentStyle={{ gap: 20 }}>
      <Hero>
        <HeroTop>
          <UISquareIcon
            icon={iconForVolume(distance)}
            size={48}
            iconSize={24}
            color={tone.square}
            bgOpacity={20}
          />
          <HeroInfo>
            <WorkoutName numberOfLines={2}>{workout.name}</WorkoutName>
            <DateRow>
              <Icon
                source="calendar-blank-outline"
                size={13}
                color={theme.colors.onSurfaceVariant}
              />
              <DateText>
                {formatDatetime(new Date(workout.scheduled_at))}
              </DateText>
            </DateRow>
          </HeroInfo>
        </HeroTop>

        <StatusPill color={tone.color}>
          <Icon source={tone.icon} size={14} color={tone.color} />
          <StatusText color={tone.color}>
            {WORKOUT_STATUS_LABELS[workout.status]}
          </StatusText>
        </StatusPill>

        {!!workout.description && (
          <Description>{workout.description}</Description>
        )}
      </Hero>

      <Stats>
        <StatTile icon="swim" label="Volume" value={formatMeters(distance)} />
        <StatTile
          icon="timer-outline"
          label="Séries"
          value={formatTotalDuration(duration)}
        />
        <StatTile
          icon="pause-circle-outline"
          label="Descanso"
          value={formatTotalDuration(restSeconds)}
        />
      </Stats>

      <Sections>
        <SectionsTitle>Seções</SectionsTitle>
        {sections.length === 0 ? (
          <EmptyText>Este treino não tem seções cadastradas.</EmptyText>
        ) : (
          sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              index={index + 1}
            />
          ))
        )}
      </Sections>

      <Footer>
        <UIButton
          text={isCompleted ? 'Desmarcar conclusão' : 'Marcar como concluído'}
          iconLeft={isCompleted ? 'close' : 'check'}
          loading={toggling}
          disabled={!canToggle}
          onPress={toggleCompletion}
          fullWidth
          style={isCompleted ? { backgroundColor: '#22C55E' } : undefined}
        />
        {!canToggle && (
          <FooterHint>
            Você poderá marcar a conclusão quando o treino começar.
          </FooterHint>
        )}
        {isCompleted && !!workout.completed_at && (
          <CompletedAt>
            Concluído em {formatDatetime(new Date(workout.completed_at))}
          </CompletedAt>
        )}
      </Footer>
    </UIScreen>
  );
}

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.Pressable`
  padding: 4px;
`;

const ScreenTitle = styled.Text`
  flex: 1;
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Loading = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
`;

const Hero = styled.View`
  gap: 12px;
`;

const HeroTop = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const HeroInfo = styled.View`
  flex: 1;
  gap: 5px;
`;

const WorkoutName = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const DateRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const DateText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const StatusPill = styled.View<{ color: string }>`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  border-radius: 20px;
  padding: 4px 10px;
  background-color: ${({ color }) => `${color}20`};
`;

const StatusText = styled.Text<{ color: string }>`
  font-size: 12px;
  font-weight: 700;
  color: ${({ color }) => color};
`;

const Description = styled.Text`
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const Stats = styled.View`
  flex-direction: row;
  gap: 10px;
`;

const Sections = styled.View`
  gap: 10px;
`;

const SectionsTitle = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const EmptyText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const Footer = styled.View`
  gap: 8px;
  margin-top: 4px;
`;

const FooterHint = styled.Text`
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const CompletedAt = styled.Text`
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;
