import { UIUserHeader } from '@/components/UI/UserHeader';
import { FilterTabs, WorkoutFilter } from '@/components/Workouts/FilterTabs';
import { toWorkout, Workout } from '@/components/Workouts/types';
import { WeekNavigator } from '@/components/Workouts/WeekNavigator';
import { WorkoutSection } from '@/components/Workouts/WorkoutSection';
import { UIScreen } from '@/components/UI/Screen';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import WorkoutService from '@/services/workout.service';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { ActivityIndicator, Icon } from 'react-native-paper';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import styled from 'styled-components/native';

function getWeekBounds(offset: number): {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
} {
  const start = dayjs().startOf('week').add(offset, 'week');
  const end = start.endOf('week');
  return { start, end };
}

export default function WorkoutsScreen() {
  const router = useRouter();
  const { snack } = useSnackbar();
  const [weekOffset, setWeekOffset] = useState(0);
  const [direction, setDirection] = useState(1);
  const [filter, setFilter] = useState<WorkoutFilter>('all');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const changeWeek = (dir: number) => {
    setDirection(dir);
    setWeekOffset((o) => o + dir);
  };

  useEffect(() => {
    let active = true;
    const { start, end } = getWeekBounds(weekOffset);
    setLoading(true);

    WorkoutService.list({
      from: start.toISOString(),
      to: end.toISOString(),
      status: filter === 'all' ? undefined : filter,
      limit: 100,
    })
      .then((res) => {
        if (active) setWorkouts(res.items.map(toWorkout));
      })
      .catch(() => {
        if (active) snack('Erro ao carregar treinos');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset, filter]);

  const { scheduled, past } = useMemo(
    () => ({
      scheduled: workouts.filter((w) => w.status === 'scheduled'),
      past: workouts.filter((w) => w.status !== 'scheduled'),
    }),
    [workouts],
  );

  const isEmpty = !loading && scheduled.length === 0 && past.length === 0;

  const weekSwipe = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onEnd((e) => {
      if (e.translationX <= -50) changeWeek(1);
      else if (e.translationX >= 50) changeWeek(-1);
    });

  const tabSwipe = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onEnd((e) => {
      if (e.translationX <= -50) router.navigate('/notifications');
      else if (e.translationX >= 50) router.navigate('/');
    });

  const header = (
    <GestureDetector gesture={tabSwipe}>
      <HeaderStack>
        <UIUserHeader title="Treinos" />
        <WeekNavigator
          offset={weekOffset}
          onPrev={() => changeWeek(-1)}
          onNext={() => changeWeek(1)}
        />
        <FilterTabs active={filter} onChange={setFilter} />
      </HeaderStack>
    </GestureDetector>
  );

  return (
    <UIScreen header={header} contentStyle={{ gap: 20, flexGrow: 1 }}>
      <GestureDetector gesture={weekSwipe}>
        <SwipeArea>
          <Animated.View
            key={weekOffset}
            entering={(direction >= 0 ? SlideInRight : SlideInLeft).duration(
              220,
            )}
            style={{ flex: 1, gap: 20 }}
          >
            {loading ? (
              <Loading>
                <ActivityIndicator />
              </Loading>
            ) : isEmpty ? (
              <EmptyState>
                <Icon
                  source="calendar-blank-outline"
                  size={48}
                  color="#A0A0A0"
                />
                <EmptyTitle>Nenhum treino nesta semana</EmptyTitle>
                <EmptyText>
                  Arraste para o lado para ver outras semanas.
                </EmptyText>
              </EmptyState>
            ) : (
              <>
                <WorkoutSection title="Agendados" workouts={scheduled} />
                <WorkoutSection title="Passados" workouts={past} />
              </>
            )}
          </Animated.View>
        </SwipeArea>
      </GestureDetector>
    </UIScreen>
  );
}

const SwipeArea = styled.View`
  flex: 1;
  gap: 20px;
`;

const HeaderStack = styled.View`
  gap: 14px;
`;

const Loading = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
`;

const EmptyState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 24px;
`;

const EmptyTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const EmptyText = styled.Text`
  font-size: 13px;
  text-align: center;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;
