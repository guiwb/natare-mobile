import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

type TabBarContextValue = {
  scale: Animated.Value;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const TabBarContext = createContext<TabBarContextValue | null>(null);

export function TabBarProvider({ children }: { children: ReactNode }) {
  const scale = useRef(new Animated.Value(1)).current;
  const lastY = useRef(0);
  const target = useRef(1);

  const value = useMemo<TabBarContextValue>(() => {
    const animateTo = (to: number) => {
      if (target.current === to) return;
      target.current = to;
      Animated.timing(scale, {
        toValue: to,
        duration: 180,
        useNativeDriver: true,
      }).start();
    };

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const dy = y - lastY.current;
      if (y <= 0) animateTo(1);
      else if (dy > 6) animateTo(0.9);
      else if (dy < -6) animateTo(1);
      lastY.current = y;
    };

    return { scale, onScroll };
  }, [scale]);

  return (
    <TabBarContext.Provider value={value}>{children}</TabBarContext.Provider>
  );
}

export function useTabBar() {
  const ctx = useContext(TabBarContext);
  if (!ctx) throw new Error('useTabBar must be used within TabBarProvider');
  return ctx;
}
