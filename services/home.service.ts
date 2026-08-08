import { http } from '@/lib/http/axios';

export interface INextWorkout {
  id: string;
  name: string;
  scheduled_at: string;
  total_distance: number;
  total_duration: number;
  can_complete: boolean;
}

export interface ILastWorkout {
  id: string;
  name: string;
  scheduled_at: string;
  completed_at: string | null;
  total_distance: number;
  total_duration: number;
}

export interface IStreak {
  days: number;
  last_activity_date: string | null;
}

export interface IHomeSummary {
  next_workout: INextWorkout | null;
  last_workout: ILastWorkout | null;
  streak: IStreak;
}

export interface IHeatmapDay {
  date: string;
  distance: number;
  duration: number;
  count: number;
}

export interface IActivityHeatmap {
  month: string;
  days: IHeatmapDay[];
}

export default class HomeService {
  static async summary(): Promise<IHomeSummary> {
    const { data } = await http.get('/api/home-summary');
    return data;
  }

  static async heatmap(params: { month: string }): Promise<IActivityHeatmap> {
    const { data } = await http.get('/api/activity-heatmap', {
      params: { month: params.month },
    });
    return data;
  }
}
