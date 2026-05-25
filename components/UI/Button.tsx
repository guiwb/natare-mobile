import { Icon } from 'react-native-paper';
import styled from 'styled-components/native';

export function UIButton({
  text,
  iconLeft,
  iconRight,
  style,
  textStyle,
}: {
  text: string;
  iconLeft?: string;
  iconRight?: string;
  style?: any;
  textStyle?: any;
}) {
  return (
    <StyledPressable
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.96 : 1 }],
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      {iconLeft && <Icon source={iconLeft} size={20} />}
      <StyledText style={textStyle}>{text}</StyledText>
      {iconRight && <Icon source={iconRight} size={20} />}
    </StyledPressable>
  );
}

const StyledPressable = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
`;

const StyledText = styled.Text`
  color: white;
`;
