import { DataCard } from '@/components/Home/LastWorkoutCard/DataCard';
import { UIBadge } from '@/components/UI/Badge';
import { UIButton } from '@/components/UI/Button';
import { UICard } from '@/components/UI/Card';
import { UISquareIcon } from '@/components/UI/SquareIcon';
import { View } from 'react-native';
import styled from 'styled-components/native';

export function LastWorkoutCard() {
  return (
    <StyledCard>
      <View style={{ flexDirection: 'column', gap: 8 }}>
        <UIBadge icon="timer" text="Hoje às 17:30" />
        <StyledHeadline>Regenerativo</StyledHeadline>
        <UISquareIcon icon="swim" size={40} color="default" />
      </View>

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <DataCard title="Distância total" value="8.0" unitText="km" />
        <DataCard title="Tempo estimado" value="45" unitText="min" />
      </View>

      <UIButton
        textStyle={{ fontWeight: '700' }}
        text="Marcar como feito"
        iconRight="check-bold"
      />
    </StyledCard>
  );
}

const StyledHeadline = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: white;
`;

const StyledCard = styled(UICard)`
  flex-direction: column;
  gap: 18px;
`;
