import styled from 'styled-components/native';

const LABELS = ['Muito fraca', 'Fraca', 'Média', 'Boa', 'Forte'];
const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E'];

export function getPasswordScore(password: string): number {
  return Math.min(4, Math.floor(password.length / 3));
}

export function UIPasswordStrength({ password }: { password: string }) {
  const score = getPasswordScore(password);

  return (
    <Wrapper>
      <Segments>
        {[0, 1, 2, 3].map((i) => (
          <Segment key={i} $filled={i < score} $color={COLORS[score]} />
        ))}
      </Segments>
      <Label>
        Força: <LabelValue $color={COLORS[score]}>{LABELS[score]}</LabelValue>
      </Label>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  gap: 6px;
`;

const Segments = styled.View`
  flex-direction: row;
  gap: 4px;
`;

const Segment = styled.View<{ $filled: boolean; $color: string }>`
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background-color: ${({ theme, $filled, $color }) =>
    $filled ? $color : theme.colors.outlineVariant};
`;

const Label = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const LabelValue = styled.Text<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-weight: 700;
`;
