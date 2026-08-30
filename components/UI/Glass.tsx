import { BlurView } from 'expo-blur';
import { ComponentProps, forwardRef, Ref } from 'react';
import { Platform, View } from 'react-native';

type Props = ComponentProps<typeof BlurView>;

/**
 * Android has no usable backdrop blur (the experimental methods bleed the
 * content that sits on top of the view), so it falls back to a flat surface:
 * a subtle white veil for inline cards and an opaque panel for the floating
 * ones, which need to hide whatever scrolls under them.
 */
const androidFill = (intensity: number) =>
  intensity <= 30 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(16, 18, 24, 0.94)';

export const UIGlass = forwardRef<BlurView | View, Props>(function UIGlass(
  props,
  ref,
) {
  const { intensity = 50, tint, style, ...rest } = props;

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        ref={ref as Ref<BlurView>}
        intensity={intensity}
        tint={tint}
        style={style}
        {...rest}
      />
    );
  }

  return (
    <View
      ref={ref as Ref<View>}
      style={[{ backgroundColor: androidFill(intensity) }, style]}
      {...rest}
    />
  );
});
