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

export default class AuthService {
  static async setCSRFCookie() {
    await http.get('/sanctum/csrf-cookie');
  }

  static async login(email: string, password: string) {
    await this.setCSRFCookie();
    const { data } = await http.post('/api/login', { email, password });
    return data;
  }

  static async logout() {
    await this.setCSRFCookie();
    await http.delete('/api/logout');
  }

  static async getCurrentUser() {
    const { data } = await http.get('/api/current-user');
    return data;
  }
}
