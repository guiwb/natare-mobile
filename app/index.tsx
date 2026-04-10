import LoadingIndicator from '@/components/UI/LoadingIndicator';
import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
    } else {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, router]);

  return <LoadingIndicator />;
}
