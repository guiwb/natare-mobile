import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FADE_HEIGHT = 40;

export function UITopBlur() {
  const { top } = useSafeAreaInsets();

  return (
    <MaskedView
      style={[styles.container, { height: top + 10 }]}
      maskElement={
        <LinearGradient
          colors={['black', 'black', 'transparent']}
          locations={[0, top / (top + FADE_HEIGHT), 1]}
          style={StyleSheet.absoluteFillObject}
        />
      }
    >
      <BlurView
        intensity={60}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
});
