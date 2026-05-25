import { HomeHeader } from '@/components/Home/Header';
import { LastWorkoutCard } from '@/components/Home/LastWorkoutCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export default function HomeScreen() {
  return (
    <StyledContainer>
      <HomeHeader />
      <LastWorkoutCard />
    </StyledContainer>
  );
}

const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  padding: 20px 24px;
  gap: 24px;
`;
