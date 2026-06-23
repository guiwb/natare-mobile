import { ActivityHeatmapCard } from '@/components/Home/ActivityHeatmapCard';
import { DayStreakCard } from '@/components/Home/DayStreakCard';
import { LastWorkoutCard } from '@/components/Home/LastWorkoutCard';
import { NextWorkoutCard } from '@/components/Home/NextWorkoutCard';
import { UIScreen } from '@/components/UI/Screen';
import { UIUserHeader } from '@/components/UI/UserHeader';
import { useAuth } from '@/contexts/AuthProvider';
import { View } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  return (
    <UIScreen
      contentStyle={{ gap: 14 }}
      header={
        <UIUserHeader subtitle="Boas-vindas," title={user?.name ?? 'Início'} />
      }
    >
      <NextWorkoutCard />

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <DayStreakCard />
        <LastWorkoutCard />
      </View>

      <ActivityHeatmapCard />
    </UIScreen>
  );
}
