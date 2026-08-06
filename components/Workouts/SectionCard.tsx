import { UICard } from '@/components/UI/Card';
import { IWorkoutSection } from '@/services/workout.service';
import { Icon, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { SerieRow } from './SerieRow';
import { formatMeters, formatTotalDuration } from './types';

export function sectionStats(section: IWorkoutSection) {
  const series = section.series ?? [];

  return {
    meters: series.reduce((acc, s) => acc + s.repetitions * (s.distance || 0), 0),
    seconds: series.reduce((acc, s) => acc + s.repetitions * (s.duration || 0), 0),
    rest: section.interval || 0,
  };
}

export function SectionCard({
  section,
  index,
}: {
  section: IWorkoutSection;
  index: number;
}) {
  const theme = useTheme();
  const series = [...(section.series ?? [])].sort(
    (a, b) => a.position - b.position,
  );
  const { meters, seconds, rest } = sectionStats(section);

  return (
    <UICard>
      <Header>
        <Position>
          <PositionText>{index}</PositionText>
        </Position>
        <SectionName numberOfLines={1}>{section.name}</SectionName>
        <SeriesCount>
          {series.length} {series.length === 1 ? 'série' : 'séries'}
        </SeriesCount>
      </Header>

      {!!section.notes && (
        <Notes>
          <Icon
            source="information-outline"
            size={13}
            color={theme.colors.primary}
          />
          <NotesText>{section.notes}</NotesText>
        </Notes>
      )}

      <Meta>
        <MetaItem>
          <Icon
            source="swim"
            size={13}
            color={theme.colors.onSurfaceVariant}
          />
          <MetaText>{formatMeters(meters)}</MetaText>
        </MetaItem>
        <MetaItem>
          <Icon
            source="timer-outline"
            size={13}
            color={theme.colors.onSurfaceVariant}
          />
          <MetaText>{formatTotalDuration(seconds)}</MetaText>
        </MetaItem>
        {rest > 0 && (
          <MetaItem>
            <Icon
              source="pause-circle-outline"
              size={13}
              color={theme.colors.onSurfaceVariant}
            />
            <MetaText>Descanso {formatTotalDuration(rest)}</MetaText>
          </MetaItem>
        )}
      </Meta>

      {series.length === 0 ? (
        <Empty>Nenhuma série cadastrada.</Empty>
      ) : (
        <Series>
          {series.map((serie) => (
            <SerieRow key={serie.id} serie={serie} />
          ))}
        </Series>
      )}
    </UICard>
  );
}

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Position = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 7px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primaryContainer};
`;

const PositionText = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const SectionName = styled.Text`
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const SeriesCount = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const Notes = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 6px;
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.primaryContainer};
`;

const NotesText = styled.Text`
  flex: 1;
  font-size: 12px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Meta = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 10px;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.outline};
`;

const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const MetaText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const Series = styled.View`
  gap: 14px;
  margin-top: 12px;
`;

const Empty = styled.Text`
  margin-top: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;
