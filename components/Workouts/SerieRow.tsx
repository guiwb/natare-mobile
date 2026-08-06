import {
  EQUIPMENT_LABELS,
  INTENSITY_ZONE_LABELS,
  labelFor,
  SWIM_STROKE_LABELS,
} from '@/constants/workout';
import { IWorkoutSerie } from '@/services/workout.service';
import styled from 'styled-components/native';
import { formatDuration } from './types';

function formatVolume({ repetitions, distance, duration }: IWorkoutSerie) {
  const reps = repetitions > 1 ? `${repetitions}×` : '';
  if (distance) return `${reps}${distance}m`;
  if (duration) return `${reps}${duration}s`;
  return `${repetitions || 1}×`;
}

export function SerieRow({ serie }: { serie: IWorkoutSerie }) {
  const equipment = (serie.equipment ?? []).map((item) =>
    labelFor(EQUIPMENT_LABELS, item),
  );
  const zone = labelFor(INTENSITY_ZONE_LABELS, serie.intensity_zone);
  const time = serie.duration ? formatDuration(serie.duration) : null;

  return (
    <Container>
      <Accent />

      <Body>
        <TopRow>
          <Volume>{formatVolume(serie)}</Volume>
          <Stroke numberOfLines={1}>
            {labelFor(SWIM_STROKE_LABELS, serie.swim_stroke)}
          </Stroke>
          {!!time && <Time>{time}</Time>}
        </TopRow>

        <Tags>
          {!!zone && (
            <Zone>
              <ZoneText>{zone}</ZoneText>
            </Zone>
          )}
          {equipment.map((label) => (
            <Chip key={label}>
              <ChipText>{label}</ChipText>
            </Chip>
          ))}
        </Tags>

        {!!serie.notes && <Notes>{serie.notes}</Notes>}
      </Body>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  gap: 10px;
`;

const Accent = styled.View`
  width: 2px;
  border-radius: 1px;
  background-color: ${({ theme }) => theme.colors.primaryContainer};
`;

const Body = styled.View`
  flex: 1;
  gap: 6px;
  padding: 2px 0;
`;

const TopRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  gap: 8px;
`;

const Volume = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Stroke = styled.Text`
  flex: 1;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const Time = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const Tags = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
`;

const Zone = styled.View`
  border-radius: 6px;
  padding: 2px 8px;
  background-color: ${({ theme }) => theme.colors.primaryContainer};
`;

const ZoneText = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Chip = styled.View`
  border-radius: 6px;
  padding: 2px 8px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outline};
`;

const ChipText = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const Notes = styled.Text`
  font-size: 12px;
  font-style: italic;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;
