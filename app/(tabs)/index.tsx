import { ActivityHeatmapCard } from '@/components/Home/ActivityHeatmapCard';
import { DayStreakCard } from '@/components/Home/DayStreakCard';
import { HomeHeader } from '@/components/Home/Header';
import { LastWorkoutCard } from '@/components/Home/LastWorkoutCard';
import { NextWorkoutCard } from '@/components/Home/NextWorkoutCard';
import { UIScreen } from '@/components/UI/Screen';
import { View } from 'react-native';

export default function HomeScreen() {
  return (
    <UIScreen header={<HomeHeader />}>
      <NextWorkoutCard />

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <DayStreakCard />
        <LastWorkoutCard />
      </View>

      <ActivityHeatmapCard />
    </UIScreen>
  );
}
