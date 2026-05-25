import { DataCard } from '@/components/Home/LastWorkoutCard/DataCard';
import { UIBadge } from '@/components/UI/Badge';
import { UIButton } from '@/components/UI/Button';
import { UICard } from '@/components/UI/Card';
import { View } from 'react-native';
import { Icon } from 'react-native-paper';
import styled, { useTheme } from 'styled-components/native';

export function LastWorkoutCard() {
  const theme = useTheme();

  return (
    <StyledCard>
      <View style={{ flexDirection: 'column', gap: 8 }}>
        <UIBadge icon="timer" text="Hoje às 17:30" />
        <StyledHeadline>Regenerativo</StyledHeadline>
        <StyledIcon>
          <Icon source="swim" size={28} color={theme.colors.primary} />
        </StyledIcon>
      </View>

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <DataCard title="Distância total" value="8.0" unitText="m" />
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

const StyledIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${(props) => props.theme.colors.primaryContainer};
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
`;
