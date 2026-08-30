import { UIGlass } from '@/components/UI/Glass';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
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
  return (
    <Menu
      visible={visible}
      onDismiss={onDismiss}
      anchor={anchor}
      anchorPosition={anchorPosition}
      contentStyle={[
        styles.glass,
        { borderColor: 'rgba(255, 255, 255, 0.12)' },
      ]}
    >
      <View style={styles.clip}>
        <UIGlass
          intensity={60}
          tint="dark"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {children}
      </View>
    </Menu>
  );
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 1,
  },
  clip: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});
