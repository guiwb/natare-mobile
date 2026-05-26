import { DayStreakCard } from '@/components/Home/DayStreakCard';
import { HomeHeader } from '@/components/Home/Header';
import { LastWorkoutCard } from '@/components/Home/LastWorkoutCard';
import { NextWorkoutCard } from '@/components/Home/NextWorkoutCard';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export default function HomeScreen() {
  return (
    <StyledContainer>
      <HomeHeader />
      <NextWorkoutCard />

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <DayStreakCard />
        <LastWorkoutCard />
      </View>
    </StyledContainer>
  );
}

const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  padding: 20px 24px;
  gap: 24px;
`;
