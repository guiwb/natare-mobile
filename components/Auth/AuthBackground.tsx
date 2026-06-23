import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, useColorScheme, View } from 'react-native';

export function AuthBackground() {
  const dark = useColorScheme() === 'dark';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={dark ? ['#06070a', '#0a0b10'] : ['#eef2fa', '#e2e8f4']}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(66, 133, 244, 0.22)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.25, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', 'rgba(46, 91, 203, 0.18)']}
        start={{ x: 0.7, y: 0.5 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
