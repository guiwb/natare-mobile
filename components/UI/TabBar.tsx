import { useTabBar } from '@/contexts/TabBarProvider';
import { BlurView } from 'expo-blur';
import { Animated, Pressable, View } from 'react-native';
import { Icon } from 'react-native-paper';
import styled from 'styled-components/native';

const AnimatedBlur = Animated.createAnimatedComponent(BlurView);

const ICONS: Record<string, { focused: string; unfocused: string }> = {
  index: { focused: 'home', unfocused: 'home-outline' },
  workouts: { focused: 'dumbbell', unfocused: 'dumbbell' },
  notifications: { focused: 'bell', unfocused: 'bell-outline' },
  profile: { focused: 'account', unfocused: 'account-outline' },
};

export function UITabBar({ state, navigation }: any) {
  const { scale } = useTabBar();

  return (
    <StyledBlur
      intensity={50}
      tint="dark"
      style={{ transform: [{ scale }] }}
    >
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;

        const icons = ICONS[route.name] ?? {
          focused: 'circle',
          unfocused: 'circle-outline',
        };
        const icon = focused ? icons.focused : icons.unfocused;
        const showDot = route.name === 'notifications';

        return (
          <StyledTabItem
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
          >
            <StyledPill focused={focused}>
              <IconBox>
                <Icon
                  source={icon}
                  size={24}
                  color={focused ? '#fff' : 'rgba(255, 255, 255, 0.55)'}
                />
                {showDot && <Dot />}
              </IconBox>
            </StyledPill>
          </StyledTabItem>
        );
      })}
    </StyledBlur>
  );
}

const StyledBlur = styled(AnimatedBlur)`
  position: absolute;
  bottom: 20px;
  left: 24px;
  right: 24px;
  border-radius: 50px;
  overflow: hidden;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 10px 8px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
`;

const StyledTabItem = styled(Pressable)`
  flex: 1;
  align-items: center;
`;

const StyledPill = styled.View<{ focused: boolean }>`
  width: 56px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${({ focused }) =>
    focused ? 'rgba(255, 255, 255, 0.16)' : 'transparent'};
`;

const IconBox = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
`;

const Dot = styled(View)`
  position: absolute;
  top: -2px;
  right: -3px;
  width: 9px;
  height: 9px;
  border-radius: 5px;
  background-color: #ef4444;
  border-width: 1.5px;
  border-color: rgba(20, 20, 20, 0.9);
`;
