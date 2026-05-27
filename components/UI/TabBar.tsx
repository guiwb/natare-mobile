import { BlurView } from 'expo-blur';
import { Pressable, Text } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

export function UITabBar({ state, descriptors, navigation }: any) {
  const theme = useTheme();

  return (
    <StyledBlur intensity={50} tint="dark">
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];

        const label = options.title;
        const icon = options.tabBarIcon?.() ?? 'circle';

        return (
          <StyledTabItem
            key={route.key}
            focused={focused}
            onPress={() => navigation.navigate(route.name)}
          >
            <StyledIconWrapper focused={focused}>
              <Icon
                source={icon}
                size={20}
                color={
                  focused
                    ? theme.colors.primary
                    : theme.colors.onSurfaceDisabled
                }
              />
            </StyledIconWrapper>

            <StyledLabel focused={focused}>{label}</StyledLabel>
          </StyledTabItem>
        );
      })}
    </StyledBlur>
  );
}

const StyledBlur = styled(BlurView)`
  position: absolute;
  bottom: 20px;
  left: 24px;
  right: 24px;
  border-radius: 50px;
  overflow: hidden;
  flex-direction: row;
  justify-content: space-around;
  padding: 8px 0;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
`;

const StyledTabItem = styled(Pressable)<{ focused: boolean }>`
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border-radius: 24px;
`;

const StyledIconWrapper = styled.View<{ focused: boolean }>`
  width: 48px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${({ focused, theme }) =>
    focused ? theme.colors.primaryContainer : 'transparent'};
`;

const StyledLabel = styled(Text)<{ focused: boolean }>`
  color: ${({ focused, theme }) =>
    focused ? theme.colors.primary : theme.colors.onSurfaceDisabled};
`;
