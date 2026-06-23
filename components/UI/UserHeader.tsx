import { UILogo } from '@/components/UI/Logo';
import { UIProfilePicture } from '@/components/UI/ProfilePicture';
import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import styled from 'styled-components/native';

export function UIUserHeader({
  title,
  subtitle,
  showAvatar = true,
}: {
  title: string;
  subtitle?: string;
  showAvatar?: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Container>
      <Pressable onPress={() => router.navigate('/')}>
        <UILogo size={45} />
      </Pressable>

      <Greetings>
        {subtitle && <Greeting>{subtitle}</Greeting>}
        <Title>{title}</Title>
      </Greetings>

      {showAvatar && (
        <Pressable onPress={() => router.navigate('/profile')}>
          <UIProfilePicture uri={user?.profile_picture} name={user?.name} />
        </Pressable>
      )}
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const Greetings = styled.View`
  flex: 1;
  gap: 3px;
`;

const Greeting = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const Title = styled(Text)`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;
