import { ActivityHeatmapCard } from '@/components/Home/ActivityHeatmapCard';
import { DayStreakCard } from '@/components/Home/DayStreakCard';
import { HomeHeader } from '@/components/Home/Header';
import { LastWorkoutCard } from '@/components/Home/LastWorkoutCard';
import { NextWorkoutCard } from '@/components/Home/NextWorkoutCard';
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: 24,
        paddingBottom: 120,
        paddingHorizontal: 24,
        paddingTop: 60,
      }}
    >
      <HomeHeader />
      <NextWorkoutCard />

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <DayStreakCard />
        <LastWorkoutCard />
      </View>

      <ActivityHeatmapCard />
    </ScrollView>
  );
}
