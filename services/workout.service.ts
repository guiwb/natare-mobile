import { http } from '@/lib/http/axios';

export type WorkoutStatus =
  | 'scheduled'
  | 'in_progress'
  | 'awaiting_confirmation'
  | 'completed'
  | 'missed';

export interface IWorkoutSerie {
  id: string;
  position: number;
  workout_section_id: string;
  distance: number;
  repetitions: number;
  duration: number;
  equipment?: string[];
  intensity_zone: string;
  swim_stroke: string;
  notes?: string;
}

export interface IWorkoutSection {
  id: string;
  name: string;
  notes?: string | null;
  position: number;
  interval?: number;
  workout_id: string;
  series?: IWorkoutSerie[];
}

export interface IWorkout {
  id: string;
  name: string;
  description?: string;
  scheduled_at: string;
  status: WorkoutStatus;
  completed_at?: string | null;
  completions_count?: number;
  total_distance?: number;
  total_duration?: number;
  created_at: string;
  updated_at: string;
  sections?: IWorkoutSection[];
}

export interface IWorkoutList {
  items: IWorkout[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface IWorkoutListParams {
  from?: string;
  to?: string;
  status?: WorkoutStatus;
  offset?: number;
  limit?: number;
}

export default class WorkoutService {
  static async list(params: IWorkoutListParams = {}): Promise<IWorkoutList> {
    const { data } = await http.get('/api/workouts', {
      params: {
        scheduled_from: params.from,
        scheduled_to: params.to,
        status: params.status,
        offset: params.offset,
        limit: params.limit,
      },
    });
    return data;
  }

  static async get(id: string): Promise<IWorkout> {
    const { data } = await http.get(`/api/workouts/${id}`);
    return data;
  }

  static async complete(id: string): Promise<IWorkout> {
    const { data } = await http.post(`/api/workouts/${id}/completion`);
    return data;
  }

  static async uncomplete(id: string): Promise<IWorkout> {
    const { data } = await http.delete(`/api/workouts/${id}/completion`);
    return data;
  }
}
