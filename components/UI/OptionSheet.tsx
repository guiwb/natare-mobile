import { Modal } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

type TParams = {
  visible: boolean;
  title: string;
  options: string[];
  value?: string | null;
  onSelect: (option: string) => void;
  onDismiss: () => void;
};

export function UIOptionSheet({
  visible,
  title,
  options,
  value,
  onSelect,
  onDismiss,
}: TParams) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Overlay onPress={onDismiss}>
        <Sheet onPress={() => {}}>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <CloseButton onPress={onDismiss}>
              <Icon
                source="close"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </CloseButton>
          </SheetHeader>

          {options.map((option) => {
            const selected = option === value;

            return (
              <OptionRow
                key={option}
                $selected={selected}
                onPress={() => {
                  onSelect(option);
                  onDismiss();
                }}
              >
                <OptionText $selected={selected}>{option}</OptionText>
                {selected && (
                  <Icon source="check" size={20} color={theme.colors.primary} />
                )}
              </OptionRow>
            );
          })}
        </Sheet>
      </Overlay>
    </Modal>
  );
}

const Overlay = styled.Pressable`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Sheet = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 16px;
  padding-bottom: 40px;
`;

const SheetHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SheetTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const CloseButton = styled.Pressable`
  padding: 8px;
`;

const OptionRow = styled.Pressable<{ $selected: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 8px;
  border-radius: 12px;
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.surfaceVariant : 'transparent'};
`;

const OptionText = styled.Text<{ $selected: boolean }>`
  font-size: 15px;
  font-weight: ${({ $selected }) => ($selected ? '700' : '500')};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.onSurface};
`;
