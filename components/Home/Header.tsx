import { UILogo } from '@/components/UI/Logo';
import { UIProfilePicture } from '@/components/UI/ProfilePicture';
import { useAuth } from '@/contexts/AuthProvider';
import { Text } from 'react-native-paper';
import styled from 'styled-components/native';

export function HomeHeader() {
  const { user } = useAuth();
  return (
    <StyledView>
      <UIProfilePicture uri={user?.profile_picture} name={user?.name} />

      <StyledGreetings>
        <StyledSmallText>Boas-vindas</StyledSmallText>
        <StyledHeadlineText>{user?.name}</StyledHeadlineText>
      </StyledGreetings>

      <UILogo size={45} />
    </StyledView>
  );
}

const StyledView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const StyledGreetings = styled.View`
  flex-direction: column;
  gap: 3px;
  flex: 1;
`;

const StyledSmallText = styled(Text)`
  font-size: 12px;
  color: ${(props) => props.theme.colors.onSurfaceVariant};
`;

const StyledHeadlineText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.onSurface};
`;
