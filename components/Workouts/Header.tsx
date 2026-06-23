import { UILogo } from '@/components/UI/Logo';
import { UIProfilePicture } from '@/components/UI/ProfilePicture';
import { useAuth } from '@/contexts/AuthProvider';
import { Text } from 'react-native-paper';
import styled from 'styled-components/native';

export function WorkoutsHeader() {
  const { user } = useAuth();

  return (
    <Container>
      <UIProfilePicture uri={user?.profile_picture} name={user?.name} />
      <Title>Seus treinos</Title>
      <UILogo size={45} />
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
