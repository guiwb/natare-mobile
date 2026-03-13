import AuthService, { IUser } from '@/services/auth.service';
import { createContext, useCallback, useContext, useState } from 'react';

interface AuthContextType {
  getCurrentUser: () => Promise<void>;
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const user = await AuthService.getCurrentUser();
      setUser(user);
    } catch (error: any) {
      if (error.status !== 401) return alert(error);

      //   navigate('/login')
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) throw 'Preencha todos os campos!';

      const user = await AuthService.login(email, password);
      setUser(user);

      //   navigate('/')
    } catch {
      throw new Error('Usuário e/ou senha inválidos!');
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      //   navigate('/login')
    } catch {
      throw new Error('Erro ao deslogar!');
    }
  };

  return (
    <AuthContext.Provider
      value={{ getCurrentUser, user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
