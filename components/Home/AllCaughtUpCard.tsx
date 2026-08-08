import { UICard } from '@/components/UI/Card';
import { Icon } from 'react-native-paper';
import styled from 'styled-components/native';

const GREEN = '#22C55E';

export function AllCaughtUpCard() {
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
