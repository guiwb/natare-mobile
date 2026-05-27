import { UIIconButton } from '@/components/UI/IconButton';
import { UIProfilePicture } from '@/components/UI/ProfilePicture';
import { Text } from 'react-native-paper';
import styled from 'styled-components/native';

export function WorkoutsHeader() {
  return (
    <Container>
      <UIProfilePicture uri="https://avatars.githubusercontent.com/u/12345678?v=4" />
      <Title>Seus treinos</Title>
      <UIIconButton icon="bell-outline" onPress={() => {}} />
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const Title = styled(Text)`
  flex: 1;
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;
