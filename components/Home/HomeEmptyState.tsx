import { UIButton } from '@/components/UI/Button';
import { UICard } from '@/components/UI/Card';
import { UISquareIcon } from '@/components/UI/SquareIcon';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

export function HomeEmptyState() {
  const router = useRouter();

  return (
    <StyledCard>
      <UISquareIcon icon="swim" size={56} iconSize={30} bgOpacity={20} />
      <Title>Nenhum treino por aqui ainda</Title>
      <Description>
        Quando seu técnico agendar um treino, ele aparece aqui com a distância e
        o tempo estimado.
      </Description>
      <UIButton
        fullWidth
        text="Ver meus treinos"
        iconRight="arrow-right"
        onPress={() => router.navigate('/workouts')}
      />
    </StyledCard>
  );
}

const StyledCard = styled(UICard)`
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Description = styled.Text`
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;
