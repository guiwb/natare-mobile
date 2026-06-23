import { ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-paper';
import styled from 'styled-components/native';

export function UIButton({
  text,
  iconLeft,
  iconRight,
  loading,
  disabled,
  fullWidth,
  style,
  textStyle,
  onPress,
}: {
  text: string;
  iconLeft?: string;
  iconRight?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: any;
  textStyle?: any;
  onPress?: () => void;
}) {
  const blocked = disabled || loading;

  return (
    <StyledPressable
      onPress={onPress}
      disabled={blocked}
      $fullWidth={fullWidth}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.96 : 1 }],
          opacity: blocked ? 0.6 : pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="white" size={20} />
      ) : (
        <>
          {iconLeft && <Icon source={iconLeft} size={20} color="white" />}
          <StyledText style={textStyle}>{text}</StyledText>
          {iconRight && <Icon source={iconRight} size={20} color="white" />}
        </>
      )}
    </StyledPressable>
  );
}

const StyledPressable = styled.Pressable<{ $fullWidth?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
`;

const StyledText = styled.Text`
  color: white;
  font-weight: 600;
`;
