import { UICard } from '@/components/UI/Card';
import { UISquareIcon } from '@/components/UI/SquareIcon';
import { View } from 'react-native';
import styled from 'styled-components/native';

export function LastWorkoutCard() {
  return (
    <StyledCard>
      <StyledMediumText>Última atividade</StyledMediumText>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <UISquareIcon icon="calendar-check" />

        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <StyledTitleText>Ontem</StyledTitleText>
          <StyledSmallText>8km de natação</StyledSmallText>
        </View>
      </View>
    </StyledCard>
  );
}

const StyledCard = styled(UICard)`
  flex: 1;
  flex-direction: column;
  gap: 12px;
`;

const StyledTitleText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.onSurface};
`;

const StyledMediumText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.onSurfaceVariant};
`;

const StyledSmallText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.onSurfaceVariant};
`;
