import { http } from '@/lib/http/axios';

type TRole = 'ADMIN' | 'COACH' | 'ATHLETE';

export interface IUser {
  id: string;
  name: string;
  email: string;
  profile_picture: string;
  role: TRole;
  created_at: Date;
  updated_at: Date;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export default class AuthService {
  static async login(email: string, password: string): Promise<ILoginResponse> {
    const { data } = await http.post('/api/login', { email, password });
    return data;
  }

  static logout(): Promise<void> {
    return http.delete('/api/logout');
  }

  static async getCurrentUser(): Promise<IUser> {
    const { data } = await http.get('/api/current-user');
    return data;
  }

  static forgotPassword(email: string): Promise<void> {
    return http.post('api/forgot-password', { email });
  }
}
