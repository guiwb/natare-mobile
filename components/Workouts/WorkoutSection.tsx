import { Workout } from './mockData';
import { WorkoutCard } from './WorkoutCard';
import styled from 'styled-components/native';

export function WorkoutSection({
  title,
  workouts,
}: {
  title: string;
  workouts: Workout[];
}) {
  if (workouts.length === 0) return null;

  return (
    <Container>
      <SectionTitle>{title}</SectionTitle>
      {workouts.map((w) => (
        <WorkoutCard key={w.id} workout={w} />
      ))}
    </Container>
  );
}

const Container = styled.View`
  gap: 10px;
`;

const SectionTitle = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
  margin-bottom: 2px;
`;
