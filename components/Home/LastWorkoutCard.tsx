import { UICard } from '@/components/UI/Card';
import { UISquareIcon } from '@/components/UI/SquareIcon';
import { formatMeters, formatShortDate } from '@/components/Workouts/types';
import { ILastWorkout } from '@/services/home.service';
import styled from 'styled-components/native';

export function LastWorkoutCard({ workout }: { workout: ILastWorkout | null }) {
  return (
    <StyledCard>
      <StyledMediumText numberOfLines={1}>Última atividade</StyledMediumText>

      <Row>
        <UISquareIcon
          icon={workout ? 'calendar-check' : 'calendar-blank-outline'}
          size={36}
          iconSize={20}
        />

        <TextColumn>
          {workout ? (
            <>
              <StyledTitleText numberOfLines={1}>
                {formatShortDate(new Date(workout.scheduled_at))}
              </StyledTitleText>
              <StyledSmallText numberOfLines={1}>
                {formatMeters(workout.total_distance)}
              </StyledSmallText>
            </>
          ) : (
            <StyledSmallText numberOfLines={2}>
              Nenhuma atividade ainda
            </StyledSmallText>
          )}
        </TextColumn>
      </Row>
    </StyledCard>
  );
}

const StyledCard = styled(UICard)`
  flex: 1;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const TextColumn = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`;

const StyledTitleText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.onSurface};
`;

const StyledMediumText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.onSurfaceVariant};
`;

const StyledSmallText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.onSurfaceVariant};
`;
