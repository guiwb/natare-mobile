import { UIIconButton } from '@/components/UI/IconButton';
import ProfilePicture from '@/components/UI/ProfilePicture';
import { Text } from 'react-native-paper';
import styled from 'styled-components/native';

export default function HomeHeader() {
  return (
    <StyledView>
      <ProfilePicture uri="https://avatars.githubusercontent.com/u/12345678?v=4" />

      <StyledGreetings>
        <StyledSmallText>Boas-vindas</StyledSmallText>
        <StyledHeadlineText>Guilherme Barbosa</StyledHeadlineText>
      </StyledGreetings>

      <UIIconButton icon="bell-outline" onPress={() => {}} />
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
