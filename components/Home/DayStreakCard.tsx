import { UICard } from '@/components/UI/Card';
import { UISquareIcon } from '@/components/UI/SquareIcon';
import { View } from 'react-native';
import styled from 'styled-components/native';

export function DayStreakCard() {
  return (
    <StyledCard>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <UISquareIcon icon="fire" color="orange" />
        <StyledStreakText>
          14 <StyledSmallText>dias</StyledSmallText>
        </StyledStreakText>
      </View>
      <StyledLabel>Em sequência</StyledLabel>
    </StyledCard>
  );
}

const StyledCard = styled(UICard)`
  flex: 1;
  flex-direction: column;
  gap: 12px;
`;

const StyledStreakText = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.onSurface};
`;

const StyledLabel = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.onSurfaceVariant};
`;

const StyledSmallText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.onSurfaceVariant};
`;
