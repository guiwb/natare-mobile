import { UICard } from '@/components/UI/Card';
import { ILastWorkout } from '@/services/home.service';
import { useRouter } from 'expo-router';
import { Icon } from 'react-native-paper';
import styled from 'styled-components/native';

const GREEN = '#22C55E';

export function AllCaughtUpCard({
  lastWorkout,
}: {
  lastWorkout: ILastWorkout | null;
}) {
  const router = useRouter();

  return (
    <StyledCard>
      <IconHalo>
        <IconRing>
          <Icon source="check-bold" size={38} color={GREEN} />
        </IconRing>
      </IconHalo>

      <Title>Tudo em dia!</Title>
      <Description>
        Você concluiu todos os treinos agendados. Assim que seu técnico marcar o
        próximo, ele aparece aqui.
      </Description>

      {!!lastWorkout && (
        <ShareButton
          onPress={() => router.navigate(`/workout/share/${lastWorkout.id}`)}
        >
          <Icon source="share-variant" size={18} color={GREEN} />
          <ShareText>Compartilhar último treino</ShareText>
        </ShareButton>
      )}
    </StyledCard>
  );
}

const StyledCard = styled(UICard)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 32px 24px;
  min-height: 280px;
  border-color: rgba(34, 197, 94, 0.35);
  background-color: rgba(34, 197, 94, 0.08);
`;

const ShareButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding: 10px 18px;
  border-radius: 22px;
  border-width: 1px;
  border-color: rgba(34, 197, 94, 0.45);
  background-color: rgba(34, 197, 94, 0.12);
`;

const ShareText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${GREEN};
`;

const IconHalo = styled.View`
  width: 108px;
  height: 108px;
  border-radius: 54px;
  align-items: center;
  justify-content: center;
  background-color: rgba(34, 197, 94, 0.12);
`;

const IconRing = styled.View`
  width: 76px;
  height: 76px;
  border-radius: 38px;
  align-items: center;
  justify-content: center;
  background-color: rgba(34, 197, 94, 0.22);
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: ${GREEN};
`;

const Description = styled.Text`
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  max-width: 280px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;
