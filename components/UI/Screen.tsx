import { useTabBar } from '@/contexts/TabBarProvider';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useRef, useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FADE = 28;

const IOS = Platform.OS === 'ios';

type Props = {
  header: ReactNode;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function UIScreen({
  header,
  children,
  contentStyle,
  keyboardShouldPersistTaps,
  refreshing,
  onRefresh,
}: Props) {
  const { top } = useSafeAreaInsets();
  const { onScroll } = useTabBar();
  const [headerHeight, setHeaderHeight] = useState(top + 64);
  const scrollRef = useRef<ScrollView>(null);
  const insetApplied = useRef(false);

  const contentTop = headerHeight + 16;

  /**
   * On iOS the content is pushed down by `contentInset`, not by padding, so
   * the RefreshControl is drawn inside the inset (below the overlaid header)
   * instead of sticking to the top of the ScrollView, behind it.
   *
   * `contentOffset` only applies on mount, when `headerHeight` is still the
   * initial guess, so the first real measurement repositions the scroll by
   * hand.
   */
  const onHeaderLayout = (height: number) => {
    setHeaderHeight(height);

    if (!IOS || insetApplied.current) return;
    insetApplied.current = true;
    // wait for the new contentInset to be applied, otherwise the scroll is
    // clamped by the old inset and the content starts partly behind the header
    requestAnimationFrame(() =>
      scrollRef.current?.scrollTo({ y: -(height + 16), animated: false }),
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        contentInset={IOS ? { top: contentTop } : undefined}
        contentOffset={IOS ? { x: 0, y: -contentTop } : undefined}
        scrollIndicatorInsets={IOS ? { top: contentTop } : undefined}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        // short screens must be able to scroll past the top, otherwise there
        // is no overscroll for the RefreshControl to react to
        alwaysBounceVertical={!!onRefresh}
        refreshControl={
          onRefresh && (
            <RefreshControl
              refreshing={!!refreshing}
              onRefresh={onRefresh}
              // on iOS the contentInset is what positions the spinner; setting
              // this here would offset it twice
              progressViewOffset={IOS ? undefined : headerHeight}
              tintColor="#FFFFFF"
              colors={['#4285F4']}
            />
          )
        }
        contentContainerStyle={[
          styles.content,
          // on iOS the header space comes from the contentInset above
          IOS ? null : { paddingTop: contentTop },
          contentStyle,
        ]}
      >
        {children}
      </ScrollView>

      <View
        style={[styles.header, { paddingTop: top + 8 }]}
        pointerEvents="box-none"
        onLayout={(e) => onHeaderLayout(e.nativeEvent.layout.height)}
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
