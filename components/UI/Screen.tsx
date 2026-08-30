import { useTabBar } from '@/contexts/TabBarProvider';
import MaskedView from '@react-native-masked-view/masked-view';
import { UIGlass } from '@/components/UI/Glass';
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
// the Android header is a plain gradient, so it fades over a shorter distance
// to clear the first card instead of overlapping it
const FADE_ANDROID = 18;

// a straight fill-to-transparent ramp reads as a hard edge, so the alpha falls
// off on a curve and the last stops are nearly invisible
const HEADER_FADE = [
  'rgba(10, 18, 32, 0.8)',
  'rgba(10, 18, 32, 0.8)',
  'rgba(10, 18, 32, 0.68)',
  'rgba(10, 18, 32, 0.47)',
  'rgba(10, 18, 32, 0.25)',
  'rgba(10, 18, 32, 0.1)',
  'rgba(10, 18, 32, 0)',
] as const;

const headerFadeStops = (solid: number) =>
  [
    0,
    solid,
    solid + (1 - solid) * 0.22,
    solid + (1 - solid) * 0.42,
    solid + (1 - solid) * 0.62,
    solid + (1 - solid) * 0.82,
    1,
  ] as const;

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
  const { top, bottom } = useSafeAreaInsets();
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
          IOS ? null : { paddingTop: contentTop, paddingBottom: 120 + bottom },
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
        {IOS ? (
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
            <UIGlass
              intensity={60}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          </MaskedView>
        ) : (
          <LinearGradient
            colors={HEADER_FADE}
            locations={headerFadeStops(
              headerHeight / (headerHeight + FADE_ANDROID),
            )}
            style={[StyleSheet.absoluteFill, { bottom: -FADE_ANDROID }]}
            pointerEvents="none"
          />
        )}
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
