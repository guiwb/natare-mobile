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

type Props = {
  date: Date;
  distance: number;
  duration: number;
  background: ShareBackground;
};

export const ShareCard = forwardRef<View, Props>(function ShareCard(
  { date, distance, duration, background },
  ref,
) {
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
    <Card ref={ref} collapsable={false} onLayout={onLayout}>
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

      <Content pointerEvents="none">
        <Brand>
          <UILogo size={34} />
          <BrandName>Natare</BrandName>
        </Brand>

        <Stats>
          <DateText>{formatFullDate(date)}</DateText>
          <StatRow>
            <Stat>
              <StatValue>{formatMeters(distance)}</StatValue>
              <StatLabel>Volume</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{formatTotalDuration(duration)}</StatValue>
              <StatLabel>Tempo</StatLabel>
            </Stat>
          </StatRow>
        </Stats>
      </Content>
    </Card>
  );
});

const Card = styled.View`
  width: 100%;
  aspect-ratio: 0.5625;
  border-radius: 20px;
  overflow: hidden;
  background-color: #0b2a4a;
`;

const Content = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: 24px;
`;

const Brand = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const BrandName = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
`;

const Stats = styled.View`
  gap: 14px;
`;

const DateText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
`;

const StatRow = styled.View`
  flex-direction: row;
  gap: 28px;
`;

const Stat = styled.View`
  gap: 2px;
`;

const StatValue = styled.Text`
  font-size: 34px;
  font-weight: 800;
  color: #ffffff;
`;

const StatLabel = styled.Text`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
`;
