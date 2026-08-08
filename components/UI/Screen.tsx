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
   * No iOS o conteudo desce por `contentInset`, e nao por padding, para o
   * RefreshControl ser desenhado dentro da inset (abaixo do header sobreposto)
   * em vez de ficar colado no topo do ScrollView, atras dele.
   *
   * `contentOffset` so vale na montagem, quando `headerHeight` ainda e o chute
   * inicial, entao a primeira medicao real reposiciona o scroll na mao.
   */
  const onHeaderLayout = (height: number) => {
    setHeaderHeight(height);

    if (!IOS || insetApplied.current) return;
    insetApplied.current = true;
    // espera a nova contentInset ser aplicada, senao o scroll e limitado pela
    // inset antiga e o conteudo nasce parcialmente atras do header
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
        // telas curtas precisam poder passar do topo, senao nao ha overscroll
        // para o RefreshControl reagir
        alwaysBounceVertical={!!onRefresh}
        refreshControl={
          onRefresh && (
            <RefreshControl
              refreshing={!!refreshing}
              onRefresh={onRefresh}
              // no iOS quem posiciona o spinner e a contentInset; aqui seria
              // deslocamento em dobro
              progressViewOffset={IOS ? undefined : headerHeight}
              tintColor="#FFFFFF"
              colors={['#4285F4']}
            />
          )
        }
        contentContainerStyle={[
          styles.content,
          // no iOS o espaco do header vem da contentInset acima
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
