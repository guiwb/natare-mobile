import { AllCaughtUpCard } from '@/components/Home/AllCaughtUpCard';
import { DataCard } from '@/components/Home/NextWorkoutCard/DataCard';
import { UIBadge } from '@/components/UI/Badge';
import { UIButton } from '@/components/UI/Button';
import { UICard } from '@/components/UI/Card';
import { UISquareIcon } from '@/components/UI/SquareIcon';
import {
  formatDatetime,
  formatMeters,
  formatTotalDuration,
  iconForVolume,
} from '@/components/Workouts/types';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import { ILastWorkout, INextWorkout } from '@/services/home.service';
import WorkoutService from '@/services/workout.service';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, View } from 'react-native';
import styled from 'styled-components/native';

export function NextWorkoutCard({
  workout,
  lastWorkout,
  loading,
  onCompleted,
}: {
  workout: INextWorkout | null;
  lastWorkout: ILastWorkout | null;
  loading: boolean;
  onCompleted: (workout: INextWorkout) => void;
}) {
  const router = useRouter();
  const { snack } = useSnackbar();
  const [completing, setCompleting] = useState(false);

  const complete = async () => {
    if (!workout || completing) return;

    setCompleting(true);
    try {
      await WorkoutService.complete(workout.id);
      DeviceEventEmitter.emit('workoutCompletionChanged');
      onCompleted(workout);
    } catch {
      snack('Não foi possível marcar o treino como feito');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <StyledCard>
        <LoadingBox>
          <ActivityIndicator />
        </LoadingBox>
      </StyledCard>
    );
  }

  if (!workout) {
    return <AllCaughtUpCard lastWorkout={lastWorkout} />;
  }

  return (
    <StyledCard onPress={() => router.navigate(`/workout/${workout.id}`)}>
      <View style={{ flexDirection: 'column', gap: 8 }}>
        <UIBadge icon="timer" text={formatDatetime(new Date(workout.scheduled_at))} />
        <StyledHeadline>{workout.name}</StyledHeadline>
        <UISquareIcon
          icon={iconForVolume(workout.total_distance)}
          size={40}
          color="default"
          bgOpacity={30}
          style={{ position: 'absolute', right: 0, top: 0 }}
        />
      </View>

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <DataCard
          title="Distância total"
          value={formatMeters(workout.total_distance)}
        />
        <DataCard
          title="Tempo estimado"
          value={formatTotalDuration(workout.total_duration)}
        />
      </View>

      <UIButton
        textStyle={{ fontWeight: '700' }}
        text="Marcar como feito"
        iconRight="check-bold"
        loading={completing}
        disabled={!workout.can_complete}
        onPress={complete}
      />
    </StyledCard>
  );
}

const StyledHeadline = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: white;
`;

const StyledCard = styled(UICard)`
  flex-direction: column;
  gap: 14px;
  padding: 16px;
`;

const LoadingBox = styled.View`
  height: 180px;
  align-items: center;
  justify-content: center;
`;
