import { Badge, Icon, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

export function UIIconButton({
  icon,
  onPress,
}: {
  icon: string;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <StyledButton
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed
          ? theme.colors.surfaceVariant
          : theme.colors.surface,
      })}
    >
      <Icon source={icon} size={20} color={theme.colors.onSurfaceVariant} />
      <Badge size={8} style={{ position: 'absolute', top: 10, right: 10 }} />
    </StyledButton>
  );
}

const StyledButton = styled.Pressable`
  position: relative;
  border-radius: 50%;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
`;
