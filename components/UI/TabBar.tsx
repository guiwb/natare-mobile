import { useNotifications } from '@/contexts/NotificationsProvider';
import { useTabBar } from '@/contexts/TabBarProvider';
import { UIGlass } from '@/components/UI/Glass';
import { Animated, Platform, Pressable, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const IOS = Platform.OS === 'ios';
const BASE_OFFSET = 20;

const ICONS: Record<string, { focused: string; unfocused: string }> = {
  index: { focused: 'home', unfocused: 'home-outline' },
  workouts: { focused: 'dumbbell', unfocused: 'dumbbell' },
  notifications: { focused: 'bell', unfocused: 'bell-outline' },
  profile: { focused: 'account', unfocused: 'account-outline' },
};

export function UITabBar({ state, navigation }: any) {
  const { scale } = useTabBar();
  const { unreadCount } = useNotifications();
  const { bottom } = useSafeAreaInsets();

  // Android draws the tab bar under the system navigation bar (edge to edge)
  const offset = BASE_OFFSET + (IOS ? 0 : bottom);

  return (
    <StyledBar style={{ transform: [{ scale }], bottom: offset }}>
      <StyledGlass intensity={50} tint="dark">
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;

          const icons = ICONS[route.name] ?? {
            focused: 'circle',
            unfocused: 'circle-outline',
          };
          const icon = focused ? icons.focused : icons.unfocused;
          const showDot = route.name === 'notifications' && unreadCount > 0;

          return (
            <StyledTabItem
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
            >
              <StyledPill>
                {focused && <PillFill />}
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
      </StyledGlass>
    </StyledBar>
  );
}

const StyledBar = styled(Animated.View)`
  position: absolute;
  bottom: 20px;
  left: 24px;
  right: 24px;
`;

const StyledGlass = styled(UIGlass)`
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

const StyledPill = styled.View`
  width: 56px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

/* a childless layer that clips itself, so Android rounds it even when the
   parent outline does not */
const PillFill = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 20px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.16);
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
