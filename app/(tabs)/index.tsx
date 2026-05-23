import HomeHeader from '@/components/Home/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export default function HomeScreen() {
  return (
    <StyledContainer>
      <HomeHeader />
    </StyledContainer>
  );
}

const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  padding: 20px 24px 24px;
  gap: 16px;
`;
