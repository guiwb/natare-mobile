import { UISquareIcon } from '@/components/UI/SquareIcon';
import { Icon, useTheme } from 'react-native-paper';
import { ReactNode } from 'react';
import styled from 'styled-components/native';

type Props = {
  icon: string;
  iconColor?: 'default' | 'red' | 'green' | 'orange';
  title: string;
  subtitle?: string;
  titleColor?: string;
  right?: ReactNode;
  onPress?: () => void;
};

export function ProfileRow({
  icon,
  iconColor = 'default',
  title,
  subtitle,
  titleColor,
  right,
  onPress,
}: Props) {
  const theme = useTheme();

  return (
    <Row
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({ opacity: pressed && onPress ? 0.7 : 1 })}
    >
      <UISquareIcon icon={icon} size={40} iconSize={20} color={iconColor} bgOpacity={15} />

      <TextBlock>
        <Title style={titleColor ? { color: titleColor } : undefined}>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TextBlock>

      {right !== undefined ? (
        right
      ) : onPress ? (
        <Icon source="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
      ) : null}
    </Row>
  );
}

const Row = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const TextBlock = styled.View`
  flex: 1;
  gap: 2px;
`;

const Title = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Subtitle = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;
