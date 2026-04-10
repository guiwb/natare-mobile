import AuthService, { IUser } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useSnackbar } from './SnackbarProvider';

interface AuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<void | Error>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { snack } = useSnackbar();
  const router = useRouter();

  const getCurrentUser = async () => {
    try {
      const token = await getItemAsync('token');

      if (!token) return;

      const user = await AuthService.getCurrentUser();
      setUser(user);
    } catch (error: any) {
      snack(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<void | Error> => {
    try {
      if (!email || !password) throw 'Preencha todos os campos!';

      const { user, token } = await AuthService.login(email, password);
      setUser(user);
      await setItemAsync('token', token);
      router.replace('/(tabs)');
    } catch (error: any) {
      snack(error.message);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      await deleteItemAsync('token');
      router.replace('/login');
    } catch (error: any) {
      snack(error.message);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await AuthService.forgotPassword(email);
    } catch {
      snack(
        'Ocorreu um erro ao enviar o e-mail de recuperação. Tente novamente mais tarde.',
      );
    }
  };

  useEffect(() => {
    if (!user) getCurrentUser();

    const sub = DeviceEventEmitter.addListener('on401', async () => {
      setUser(null);
      await deleteItemAsync('token');
    });

    return () => {
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, forgotPassword, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
