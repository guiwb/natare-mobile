import { PressableProps } from 'react-native';
import styled from 'styled-components/native';

export function UICard({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: PressableProps['style'];
  onPress?: PressableProps['onPress'];
}) {
  return <StyledCard style={style} onPress={onPress}>{children}</StyledCard>;
}

const StyledCard = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.outline};
  border-radius: 16px;
  padding: 20px;
`;
