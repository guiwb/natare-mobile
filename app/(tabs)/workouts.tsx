import { FilterTabs, WorkoutFilter } from '@/components/Workouts/FilterTabs';
import { WorkoutsHeader } from '@/components/Workouts/Header';
import { MOCK_WORKOUTS, Workout } from '@/components/Workouts/mockData';
import { WeekNavigator } from '@/components/Workouts/WeekNavigator';
import { WorkoutSection } from '@/components/Workouts/WorkoutSection';
import { UIScreen } from '@/components/UI/Screen';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Icon } from 'react-native-paper';
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

function filterByWeek(workouts: Workout[], offset: number): Workout[] {
  const { start, end } = getWeekBounds(offset);
  return workouts.filter((w) => {
    const d = dayjs(w.datetime);
    return d.isAfter(start.subtract(1, 'ms')) && d.isBefore(end.add(1, 'ms'));
  });
}

export default function WorkoutsScreen() {
  const router = useRouter();
  const [weekOffset, setWeekOffset] = useState(0);
  const [direction, setDirection] = useState(1);
  const [filter, setFilter] = useState<WorkoutFilter>('all');

  const changeWeek = (dir: number) => {
    setDirection(dir);
    setWeekOffset((o) => o + dir);
  };

  const weekWorkouts = useMemo(
    () => filterByWeek(MOCK_WORKOUTS, weekOffset),
    [weekOffset],
  );

  const { scheduled, past } = useMemo(() => {
    const applyFilter = (w: Workout) => filter === 'all' || w.status === filter;

    return {
      scheduled: weekWorkouts.filter(
        (w) => w.status === 'scheduled' && applyFilter(w),
      ),
      past: weekWorkouts.filter(
        (w) =>
          (w.status === 'completed' || w.status === 'missed') && applyFilter(w),
      ),
    };
  }, [weekWorkouts, filter]);

  const isEmpty = scheduled.length === 0 && past.length === 0;

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
        <WorkoutsHeader />
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
            {isEmpty ? (
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
