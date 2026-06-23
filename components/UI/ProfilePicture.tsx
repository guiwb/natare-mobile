import styled from 'styled-components/native';

function getInitials(name?: string) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

type Props = {
  uri?: string | null;
  name?: string;
  size?: number;
  borderColor?: string;
};

export function UIProfilePicture({
  uri,
  name,
  size = 45,
  borderColor = 'rgba(66, 133, 244, 0.4)',
}: Props) {
  if (uri) {
    return (
      <StyledImage
        $size={size}
        $borderColor={borderColor}
        source={{ uri }}
        alt="Profile Picture"
      />
    );
  }

  return (
    <StyledFallback $size={size} $borderColor={borderColor}>
      <StyledInitials $size={size}>{getInitials(name)}</StyledInitials>
    </StyledFallback>
  );
}

type StyleProps = { $size: number; $borderColor: string };

const StyledImage = styled.Image<StyleProps>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${({ $size }) => $size}px;
  border-width: 3px;
  border-color: ${({ $borderColor }) => $borderColor};
  object-fit: cover;
`;

const StyledFallback = styled.View<StyleProps>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${({ $size }) => $size}px;
  border-width: 3px;
  border-color: ${({ $borderColor }) => $borderColor};
  background-color: rgba(66, 133, 244, 0.15);
  align-items: center;
  justify-content: center;
`;

const StyledInitials = styled.Text<{ $size: number }>`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ $size }) => Math.round($size * 0.35)}px;
  font-weight: 700;
`;
