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
   * `silent` mantem o conteudo atual na tela enquanto rebusca, para o
   * pull-to-refresh e o pos-conclusao nao derrubarem os cards para o
   * esqueleto de carregamento.
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

  /**
   * O overlay abre na hora e o refetch corre por baixo: o streak novo entra
   * quando a resposta chega. Quem controla quando fechar e o proprio overlay
   * (auto-dismiss ou toque do usuario).
   */
  const onCompleted = useCallback(
    async (workout: INextWorkout) => {
      setOverlayStreak(null);
      setCompleted({
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
