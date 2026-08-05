import { http } from '@/lib/http/axios';

export type WorkoutStatus = 'scheduled' | 'completed' | 'missed';

export interface IWorkout {
  id: string;
  name: string;
  description?: string;
  scheduled_at: string;
  status: WorkoutStatus;
  total_distance?: number;
  total_duration?: number;
  created_at: string;
  updated_at: string;
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
}
