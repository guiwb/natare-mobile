import { WorkoutStatus } from '@/services/workout.service';

export const SWIM_STROKE_LABELS: Record<string, string> = {
  FREESTYLE: 'Livre',
  CRAWL: 'Crawl',
  STYLE: 'Estilo',
  LEG_STROKE: 'Perna',
  BACKSTROKE: 'Costas',
  BREASTSTROKE: 'Peito',
  BUTTERFLY: 'Borboleta',
  INDIVIDUAL_MEDLEY: 'Medley',
  MEDLEY_RELAY: 'Revezamento',
  DRILL: 'Educativo',
};

export const INTENSITY_ZONE_LABELS: Record<string, string> = {
  A1: 'A1',
  A2: 'A2',
  A3: 'A3',
  A4: 'A4',
  SOLTO: 'Solto',
  PROGRESSIVE: 'Progressivo',
  SPEED: 'Velocidade',
};

export const EQUIPMENT_LABELS: Record<string, string> = {
  FINS: 'Pé de pato',
  PADDLES: 'Palmar',
  PULL_BUOY: 'Flutuador',
  KICKBOARD: 'Prancha',
  SNORKEL: 'Snorkel',
  PARACHUTE: 'Paraquedas',
};

export const WORKOUT_STATUS_LABELS: Record<WorkoutStatus, string> = {
  scheduled: 'Agendado',
  completed: 'Concluído',
  missed: 'Perdido',
};

export function labelFor(
  labels: Record<string, string>,
  value?: string | null,
): string {
  if (!value) return '';
  return labels[value] ?? value;
}
