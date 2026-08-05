import { IWorkout, WorkoutStatus } from '@/services/workout.service';

export type { WorkoutStatus };

export type Workout = {
  id: string;
  name: string;
  icon: string;
  status: WorkoutStatus;
  datetime: Date;
  distance?: number;
  duration: number;
};

export function iconForVolume(distanceMeters: number): string {
  if (!distanceMeters) return 'swim';
  const km = distanceMeters / 1000;
  if (km < 1.5) return 'pool';
  if (km <= 3) return 'swim';
  return 'waves';
}

export function toWorkout(item: IWorkout): Workout {
  return {
    id: item.id,
    name: item.name,
    icon: iconForVolume(item.total_distance ?? 0),
    status: item.status,
    datetime: new Date(item.scheduled_at),
    distance: item.total_distance ? item.total_distance / 1000 : undefined,
    duration: item.total_duration ?? 0,
  };
}
