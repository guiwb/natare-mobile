import { formatMeters } from '@/components/Workouts/types';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { BackHandler, Modal, Pressable } from 'react-native';
import { Icon } from 'react-native-paper';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import styled from 'styled-components/native';

const EXIT_MS = 280;
const AUTO_DISMISS_MS = 10000;

export type CompletedWorkout = {
  name: string;
  total_distance: number;
};

export function WorkoutCompletedOverlay({
  visible,
  workout,
  streakDays,
  onDismiss,
}: {
  visible: boolean;
  workout: CompletedWorkout | null;
  streakDays: number | null;
  onDismiss: () => void;
}) {
  // o Modal precisa continuar montado durante o fade de saida, senao ele
  // desaparece de uma vez e a animacao de exit nunca aparece
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    const timeout = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(timeout);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timeout);
  }, [visible, onDismiss]);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onDismiss();
      return true;
    });
    return () => sub.remove();
  }, [visible, onDismiss]);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      {visible && (
        <Backdrop
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(EXIT_MS - 20)}
        >
          <TapArea onPress={onDismiss} accessibilityLabel="Fechar">
            <Animated.View entering={ZoomIn.springify().damping(12).delay(80)}>
              <CheckCircle>
                <Icon source="check-bold" size={56} color="#16A34A" />
              </CheckCircle>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(220).duration(240)}>
              <Headline>Treino concluído!</Headline>
              {!!workout && (
                <Subtitle>
                  {workout.name}
                  {workout.total_distance > 0 &&
                    ` · ${formatMeters(workout.total_distance)}`}
                </Subtitle>
              )}
            </Animated.View>

            {streakDays !== null && (
              <StreakBlock entering={FadeIn.duration(280)}>
                <Icon source="fire" size={28} color="white" />
                <StreakDays>
                  {streakDays} {streakDays === 1 ? 'dia' : 'dias'}
                </StreakDays>
                <StreakLabel>em sequência</StreakLabel>
              </StreakBlock>
            )}
          </TapArea>

          <CloseButton onPress={onDismiss}>
            <CloseText>Fechar</CloseText>
          </CloseButton>
        </Backdrop>
      )}
    </Modal>
  );
}

const Backdrop = styled(Animated.View)`
  flex: 1;
  padding: 32px;
  background-color: #16a34a;
`;

const TapArea = styled(Pressable)`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const CheckCircle = styled.View`
  width: 104px;
  height: 104px;
  border-radius: 52px;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

const Headline = styled.Text`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  color: white;
`;

const Subtitle = styled.Text`
  margin-top: 6px;
  font-size: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
`;

const StreakBlock = styled(Animated.View)`
  align-items: center;
  gap: 2px;
  margin-top: 8px;
`;

const StreakDays = styled.Text`
  font-size: 30px;
  font-weight: 700;
  color: white;
`;

const StreakLabel = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
`;

const CloseButton = styled.Pressable`
  align-self: center;
  margin-bottom: 24px;
  padding: 12px 32px;
  border-radius: 24px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.45);
`;

const CloseText = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: white;
`;
