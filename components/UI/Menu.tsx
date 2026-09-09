import { UISheet } from '@/components/UI/Sheet';
import { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { UIMenuItem, UIMenuProps } from './Menu.types';

export type { UIMenuItem, UIMenuProps } from './Menu.types';

export function UIMenu({
  items,
  title,
  disabled,
  children,
}: UIMenuProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const colorOf = (item: UIMenuItem) =>
    item.destructive
      ? theme.colors.error
      : item.selected
        ? theme.colors.primary
        : theme.colors.onSurface;

  if (disabled) return <>{children}</>;

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>{children}</Pressable>

      <UISheet
        visible={visible}
        title={title}
        onDismiss={() => setVisible(false)}
      >
        <ScrollView bounces={false} style={{ maxHeight: 360 }}>
          {items.map((item) => (
            <Row
              key={item.key}
              $selected={!!item.selected}
              onPress={() => {
                setVisible(false);
                item.onPress();
              }}
            >
              {!!item.icon && (
                <Icon source={item.icon} size={20} color={colorOf(item)} />
              )}

              <RowText style={{ color: colorOf(item) }} $selected={!!item.selected}>
                {item.title}
              </RowText>

              {item.selected && (
                <Icon source="check" size={20} color={theme.colors.primary} />
              )}
            </Row>
          ))}
        </ScrollView>
      </UISheet>
    </>
  );
}

const Row = styled.Pressable<{ $selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 14px 8px;
  border-radius: 12px;
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryContainer : 'transparent'};
`;

const RowText = styled.Text<{ $selected: boolean }>`
  flex: 1;
  font-size: 15px;
  font-weight: ${({ $selected }) => ($selected ? '700' : '500')};
`;
