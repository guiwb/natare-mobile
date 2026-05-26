import { Icon } from 'react-native-paper';
import styled from 'styled-components/native';

const colorMap = {
  default: '#4285f4',
  red: '#EF4444',
  green: '#22C55E',
  orange: '#F97316',
};

export function UISquareIcon({
  icon,
  iconSize = 24,
  size = 40,
  color = 'default',
  bgOpacity = 10,
  style,
}: {
  icon: string;
  iconSize?: number;
  size?: number;
  color?: 'red' | 'green' | 'orange' | 'default';
  bgOpacity?: number;
  style?: any;
}) {
  const bgColor = `${colorMap[color]}${bgOpacity}`;

  return (
    <StyledIcon size={size} bgColor={bgColor} style={style}>
      <Icon source={icon} size={iconSize} color={colorMap[color]} />
    </StyledIcon>
  );
}

const StyledIcon = styled.View<{ size: number; bgColor: string }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center;
  justify-content: center;
`;
