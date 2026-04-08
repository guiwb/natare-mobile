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

export interface IUsersList {
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
  items: IUser[];
}

export interface ICreateUpdateUser {
  name: string;
  email: string;
  role: TRole;
  password: string;
  confirmPassword: string;
}

export default class UserService {
  static async create(data: ICreateUpdateUser): Promise<IUser> {
    const { data: response } = await http.post('/api/users', data);
    return response;
  }

  static async update(id: string, data: ICreateUpdateUser): Promise<IUser> {
    const { data: response } = await http.patch(`/api/users/${id}`, data);
    return response;
  }

  static async delete(id: string): Promise<void> {
    return http.delete(`/api/users/${id}`);
  }

  static async list(offset: number, limit: number): Promise<IUsersList> {
    const { data } = await http.get(
      `/api/users?offset=${offset}&limit=${limit}`,
    );
    return data;
  }
}
