import { useTabBar } from '@/contexts/TabBarProvider';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useState } from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FADE = 28;

type Props = {
  header: ReactNode;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
};

export function UIScreen({
  header,
  children,
  contentStyle,
  keyboardShouldPersistTaps,
}: Props) {
  const { top } = useSafeAreaInsets();
  const { onScroll } = useTabBar();
  const [headerHeight, setHeaderHeight] = useState(top + 64);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + 16 },
          contentStyle,
        ]}
      >
        {children}
      </ScrollView>

      <View
        style={[styles.header, { paddingTop: top + 8 }]}
        pointerEvents="box-none"
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <MaskedView
          style={[StyleSheet.absoluteFill, { bottom: -FADE }]}
          pointerEvents="none"
          maskElement={
            <LinearGradient
              colors={['black', 'black', 'transparent']}
              locations={[0, headerHeight / (headerHeight + FADE), 1]}
              style={StyleSheet.absoluteFill}
            />
          }
        >
          <BlurView
            intensity={60}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
        <View style={styles.headerInner}>{header}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
    paddingBottom: 120,
    paddingHorizontal: 24,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerInner: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
});
