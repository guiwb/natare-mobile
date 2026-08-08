import { IWorkout, WorkoutStatus } from '@/services/workout.service';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

export type { WorkoutStatus };

export type Workout = {
  id: string;
  name: string;
  icon: string;
  status: WorkoutStatus;
  datetime: Date;
  distance: number;
  duration: number;
};

export function iconForVolume(distanceMeters: number): string {
  if (!distanceMeters) return 'swim';
  const km = distanceMeters / 1000;
  if (km < 1.5) return 'pool';
  if (km <= 3) return 'swim';
  return 'waves';
}

// `distance` em metros, `duration` de serie e `interval` de secao em segundos,
// mesma convencao usada no natare-web.
export function formatMeters(meters: number): string {
  if (!meters) return '--';
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1).replace('.', ',')} km`
    : `${meters} m`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

export function formatTotalDuration(seconds: number): string {
  if (!seconds) return '--';
  if (seconds < 60) return `${seconds}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
}

export function formatDatetime(date: Date): string {
  dayjs.locale('pt-br');
  const d = dayjs(date);
  const today = dayjs().startOf('day');

  if (d.isSame(today, 'day')) return `Hoje às ${d.format('HH:mm')}`;
  if (d.isSame(today.add(1, 'day'), 'day'))
    return `Amanhã às ${d.format('HH:mm')}`;
  if (d.isSame(today.subtract(1, 'day'), 'day'))
    return `Ontem às ${d.format('HH:mm')}`;
  return d.format('ddd, D [de] MMMM [às] HH:mm');
}

/**
 * Versao curta de `formatDatetime`, sem hora, para caber em cards estreitos.
 */
export function formatShortDate(date: Date): string {
  dayjs.locale('pt-br');
  const d = dayjs(date);
  const today = dayjs().startOf('day');

  if (d.isSame(today, 'day')) return 'Hoje';
  if (d.isSame(today.subtract(1, 'day'), 'day')) return 'Ontem';
  if (d.isSame(today, 'year')) return d.format('D [de] MMM');
  return d.format('D [de] MMM [de] YYYY');
}

export function toWorkout(item: IWorkout): Workout {
  return {
    id: item.id,
    name: item.name,
    icon: iconForVolume(item.total_distance ?? 0),
    status: item.status,
    datetime: new Date(item.scheduled_at),
    distance: item.total_distance ?? 0,
    duration: item.total_duration ?? 0,
  };
}
