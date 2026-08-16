import { ActivityHeatmapCard } from '@/components/Home/ActivityHeatmapCard';
import { DayStreakCard } from '@/components/Home/DayStreakCard';
import { HomeEmptyState } from '@/components/Home/HomeEmptyState';
import { LastWorkoutCard } from '@/components/Home/LastWorkoutCard';
import { NextWorkoutCard } from '@/components/Home/NextWorkoutCard';
import {
  CompletedWorkout,
  WorkoutCompletedOverlay,
} from '@/components/Home/WorkoutCompletedOverlay';
import { UIScreen } from '@/components/UI/Screen';
import { UIUserHeader } from '@/components/UI/UserHeader';
import { useAuth } from '@/contexts/AuthProvider';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import HomeService, {
  IHomeSummary,
  INextWorkout,
} from '@/services/home.service';
import { useRefresh } from '@/hooks/useRefresh';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';

const EMPTY_SUMMARY: IHomeSummary = {
  next_workout: null,
  last_workout: null,
  streak: { days: 0, last_activity_date: null },
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { snack } = useSnackbar();
  const [summary, setSummary] = useState<IHomeSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState<CompletedWorkout | null>(null);
  const [overlayStreak, setOverlayStreak] = useState<number | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  /**
   * `silent` keeps the current content on screen while refetching, so that
   * pull-to-refresh and the post-completion refresh do not drop the cards
   * back to the loading skeleton.
   */
  const fetchSummary = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await HomeService.summary();
      if (mounted.current) setSummary(data);
      return data;
    } catch {
      if (mounted.current) snack('Erro ao carregar a home');
      return null;
    } finally {
      if (mounted.current && !silent) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      'workoutCompletionChanged',
      () => fetchSummary(true),
    );
    return () => listener.remove();
  }, [fetchSummary]);

  const { refreshing, onRefresh } = useRefresh(async () => {
    DeviceEventEmitter.emit('homeRefresh');
    await fetchSummary(true);
  });

  /**
   * The overlay opens right away and the refetch runs underneath: the new
   * streak lands when the response arrives. The overlay itself decides when
   * to close (auto-dismiss or user tap).
   */
  const onCompleted = useCallback(
    async (workout: INextWorkout) => {
      setOverlayStreak(null);
      setCompleted({
        id: workout.id,
        name: workout.name,
        total_distance: workout.total_distance,
      });

      const data = await fetchSummary(true);
      if (data && mounted.current) setOverlayStreak(data.streak.days);
    },
    [fetchSummary],
  );

  const isEmpty =
    !loading &&
    !summary.next_workout &&
    !summary.last_workout &&
    summary.streak.days === 0;

  return (
    <>
      <UIScreen
        contentStyle={{ gap: 14 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        header={
          <UIUserHeader subtitle="Boas-vindas," title={user?.name ?? 'Início'} />
        }
      >
        {isEmpty ? (
          <HomeEmptyState />
        ) : (
          <>
            <NextWorkoutCard
              workout={summary.next_workout}
              lastWorkout={summary.last_workout}
              loading={loading}
              onCompleted={onCompleted}
            />

            <View style={{ flexDirection: 'row', gap: 16 }}>
              <DayStreakCard streak={summary.streak} />
              <LastWorkoutCard workout={summary.last_workout} />
            </View>
          </>
        )}

        <ActivityHeatmapCard />
      </UIScreen>

      <WorkoutCompletedOverlay
        visible={completed !== null}
        workout={completed}
        streakDays={overlayStreak}
        onDismiss={() => setCompleted(null)}
      />
    </>
  );
}
