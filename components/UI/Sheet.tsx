import { ReactNode } from 'react';
import { Modal } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  /** Confirm button label, for the sheets that host a picker. */
  doneLabel?: string;
  children: ReactNode;
};

/** Bottom sheet used by the app menus and by the iOS wheel pickers. */
export function UISheet({
  visible,
  onDismiss,
  title,
  doneLabel,
  children,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Overlay onPress={onDismiss}>
        <Sheet
          onPress={() => {}}
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          <Handle />

          {(!!title || !!doneLabel) && (
            <Header>
              <Title>{title}</Title>
              {!!doneLabel && (
                <DoneButton onPress={onDismiss}>
                  <DoneText style={{ color: theme.colors.primary }}>
                    {doneLabel}
                  </DoneText>
                </DoneButton>
              )}
            </Header>
          )}

          {children}
        </Sheet>
      </Overlay>
    </Modal>
  );
}

const Overlay = styled.Pressable`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.6);
`;

const Sheet = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-top-width: 1px;
  border-color: ${({ theme }) => theme.colors.outline};
  padding: 8px 16px 24px;
`;

const Handle = styled.View`
  align-self: center;
  width: 36px;
  height: 4px;
  border-radius: 2px;
  margin-bottom: 12px;
  background-color: rgba(255, 255, 255, 0.18);
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const DoneButton = styled.Pressable`
  padding: 8px;
`;

const DoneText = styled.Text`
  font-size: 15px;
  font-weight: 700;
`;
