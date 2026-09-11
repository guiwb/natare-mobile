import { shiftLightness, withAlpha } from '@/lib/brand';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export function AppBackground() {
  const { colors } = useTheme();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#06070a', '#0a0b10']}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[withAlpha(colors.primary, 0.22), 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.25, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[
          'transparent',
          withAlpha(shiftLightness(colors.primary, -0.12), 0.18),
        ]}
        start={{ x: 0.7, y: 0.5 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
