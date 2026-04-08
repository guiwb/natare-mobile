import { Button, Dialog, Portal, Text } from 'react-native-paper';

interface IProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  visible,
  onDismiss,
  onConfirm,
  title = 'Confirmar',
  message = 'Tem certeza?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
}: IProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>

        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={onDismiss} disabled={loading}>
            {cancelText}
          </Button>
          <Button onPress={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
