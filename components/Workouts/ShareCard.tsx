import { UILogo } from '@/components/UI/Logo';
import {
  formatFullDate,
  formatMeters,
  formatTotalDuration,
} from '@/components/Workouts/types';
import { ShareBackground } from '@/constants/shareBackgrounds';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef, useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const MAX_SCALE = 4;

/**
 * The card is laid out against a fixed 360pt canvas and every size is scaled
 * from it, so the exported 1080x1920 image is identical on any phone. Without
 * this the capture is resized by a different factor on each screen width and
 * the typography ends up bigger or smaller than intended.
 */
const BASE_WIDTH = 360;

type Props = {
  width: number;
  /** flattened while exporting: transparent corners come back black in apps
      that drop the alpha channel */
  rounded?: boolean;
  date: Date;
  distance: number;
  duration: number;
  background: ShareBackground;
};

export const ShareCard = forwardRef<View, Props>(function ShareCard(
  { width, rounded = true, date, distance, duration, background },
  ref,
) {
  const k = width / BASE_WIDTH;
  const [size, setSize] = useState({ width: 0, height: 0 });
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const photoUri = background.type === 'photo' ? background.uri : null;

  useEffect(() => {
    scale.value = withTiming(1);
    savedScale.value = 1;
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoUri]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  /**
   * The image covers the card at scale 1, so the panning room is whatever the
   * zoom pushes outside the card bounds.
   */
  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      const maxX = ((scale.value - 1) * size.width) / 2;
      const maxY = ((scale.value - 1) * size.height) / 2;
      translateX.value = withTiming(
        Math.min(Math.max(translateX.value, -maxX), maxX),
      );
      translateY.value = withTiming(
        Math.min(Math.max(translateY.value, -maxY), maxY),
      );
      savedTranslateX.value = Math.min(
        Math.max(translateX.value, -maxX),
        maxX,
      );
      savedTranslateY.value = Math.min(
        Math.max(translateY.value, -maxY),
        maxY,
      );
    });

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      const next = Math.min(Math.max(scale.value, 1), MAX_SCALE);
      scale.value = withTiming(next);
      savedScale.value = next;

      const maxX = ((next - 1) * size.width) / 2;
      const maxY = ((next - 1) * size.height) / 2;
      savedTranslateX.value = Math.min(
        Math.max(translateX.value, -maxX),
        maxX,
      );
      savedTranslateY.value = Math.min(
        Math.max(translateY.value, -maxY),
        maxY,
      );
      translateX.value = withTiming(savedTranslateX.value);
      translateY.value = withTiming(savedTranslateY.value);
    });

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const image = (
    <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
      <Image
        source={
          background.type === 'photo'
            ? { uri: background.uri }
            : background.source
        }
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
    </Animated.View>
  );

  return (
    // collapsable={false} keeps the view in the native hierarchy on Android,
    // otherwise there is nothing for view-shot to capture
    <Card
      ref={ref}
      collapsable={false}
      onLayout={onLayout}
      k={k}
      rounded={rounded}
    >
      {photoUri ? (
        <GestureDetector gesture={Gesture.Simultaneous(pan, pinch)}>
          {image}
        </GestureDetector>
      ) : (
        image
      )}

      {/* keeps the logo and the stats readable over any photo */}
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.10)', 'rgba(0,0,0,0.85)']}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <Content pointerEvents="none" k={k}>
        <Brand k={k}>
          <UILogo size={Math.round(34 * k)} />
          <BrandName k={k}>NatareApp</BrandName>
        </Brand>

        <Stats k={k}>
          <DateText k={k}>{formatFullDate(date)}</DateText>
          <StatRow k={k}>
            <Stat k={k}>
              <StatValue k={k}>{formatMeters(distance)}</StatValue>
              <StatLabel k={k}>Volume</StatLabel>
            </Stat>
            <Stat k={k}>
              <StatValue k={k}>{formatTotalDuration(duration)}</StatValue>
              <StatLabel k={k}>Tempo</StatLabel>
            </Stat>
          </StatRow>
        </Stats>
      </Content>
    </Card>
  );
});

const Card = styled.View<{ k: number; rounded: boolean }>`
  width: 100%;
  aspect-ratio: 0.5625;
  border-radius: ${({ k, rounded }) => (rounded ? 20 * k : 0)}px;
  overflow: hidden;
  background-color: #0b2a4a;
`;

const Content = styled.View<{ k: number }>`
  flex: 1;
  justify-content: space-between;
  padding: ${({ k }) => 24 * k}px;
`;

const Brand = styled.View<{ k: number }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ k }) => 10 * k}px;
`;

const BrandName = styled.Text<{ k: number }>`
  font-size: ${({ k }) => 20 * k}px;
  font-weight: 700;
  color: #ffffff;
`;

const Stats = styled.View<{ k: number }>`
  gap: ${({ k }) => 14 * k}px;
`;

const DateText = styled.Text<{ k: number }>`
  font-size: ${({ k }) => 13 * k}px;
  font-weight: 600;
  letter-spacing: ${({ k }) => 0.4 * k}px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
`;

const StatRow = styled.View<{ k: number }>`
  flex-direction: row;
  gap: ${({ k }) => 28 * k}px;
`;

const Stat = styled.View<{ k: number }>`
  gap: ${({ k }) => 2 * k}px;
`;

const StatValue = styled.Text<{ k: number }>`
  font-size: ${({ k }) => 34 * k}px;
  font-weight: 800;
  color: #ffffff;
`;

const StatLabel = styled.Text<{ k: number }>`
  font-size: ${({ k }) => 11 * k}px;
  font-weight: 600;
  letter-spacing: ${({ k }) => 0.6 * k}px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
`;
