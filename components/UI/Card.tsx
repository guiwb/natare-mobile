import { UIGlass } from '@/components/UI/Glass';
import { PressableProps, StyleSheet } from 'react-native';
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
  return (
    <StyledCard style={style} onPress={onPress}>
      <UIGlass
        intensity={24}
        tint="dark"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {children}
    </StyledCard>
  );
}

const StyledCard = styled.Pressable`
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.04);
`;
