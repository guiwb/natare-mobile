import { http } from '@/lib/http/axios';

type TRole = 'ADMIN' | 'COACH' | 'ATHLETE';

export type TGender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export interface IUser {
  id: string;
  name: string;
  email: string;
  profile_picture: string;
  role: TRole;
  birth_date: string | null;
  weight: number | null;
  height: number | null;
  phone: string | null;
  gender: TGender | null;
  created_at: Date;
  updated_at: Date;
}

export interface ICompanyBranding {
  id: string;
  name: string;
  logo_url: string | null;
  brand_color: string | null;
}

export interface ICurrentUserResponse extends IUser {
  company: ICompanyBranding | null;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
  company: ICompanyBranding | null;
}

export default class AuthService {
  static async login(email: string, password: string): Promise<ILoginResponse> {
    const { data } = await http.post('/api/login', {
      email,
      password,
      client: 'mobile',
    });
    return data;
  }

  static logout(): Promise<void> {
    return http.delete('/api/logout');
  }

  static async getCurrentUser(): Promise<ICurrentUserResponse> {
    const { data } = await http.get('/api/current-user');
    return data;
  }

  static forgotPassword(email: string): Promise<void> {
    return http.post('api/forgot-password', { email });
  }

  static updatePassword(
    currentPassword: string,
    password: string,
  ): Promise<void> {
    return http.put('/api/password', {
      current_password: currentPassword,
      password,
      password_confirmation: password,
    });
  }

  static deleteAccount(password: string): Promise<void> {
    return http.delete('/api/account', { data: { password } });
  }
}
