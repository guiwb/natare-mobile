import { FilterTabs, WorkoutFilter } from '@/components/Workouts/FilterTabs';
import { WorkoutsHeader } from '@/components/Workouts/Header';
import { MOCK_WORKOUTS, Workout } from '@/components/Workouts/mockData';
import { WeekNavigator } from '@/components/Workouts/WeekNavigator';
import { WorkoutSection } from '@/components/Workouts/WorkoutSection';
import { UIScreen } from '@/components/UI/Screen';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

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
  const [weekOffset, setWeekOffset] = useState(0);
  const [filter, setFilter] = useState<WorkoutFilter>('all');

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

  return (
    <UIScreen header={<WorkoutsHeader />} contentStyle={{ gap: 20 }}>
      <WeekNavigator
        offset={weekOffset}
        onPrev={() => setWeekOffset((o) => o - 1)}
        onNext={() => setWeekOffset((o) => o + 1)}
      />

      <FilterTabs active={filter} onChange={setFilter} />

      <WorkoutSection title="Agendados" workouts={scheduled} />
      <WorkoutSection title="Passados" workouts={past} />
    </UIScreen>
  );
}
