import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { Menu } from 'react-native-paper';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  anchor: ReactNode;
  children: ReactNode;
  anchorPosition?: 'top' | 'bottom';
};

export function UIMenu({
  visible,
  onDismiss,
  anchor,
  children,
  anchorPosition = 'bottom',
}: Props) {
  const dark = useColorScheme() === 'dark';

  return (
    <Menu
      visible={visible}
      onDismiss={onDismiss}
      anchor={anchor}
      anchorPosition={anchorPosition}
      contentStyle={[
        styles.glass,
        {
          borderColor: dark
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(0, 0, 0, 0.08)',
        },
      ]}
    >
      <BlurView
        intensity={60}
        tint={dark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {children}
    </Menu>
  );
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
