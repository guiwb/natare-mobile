import { ConfirmDialog } from '@/components/UI/ConfirmDialog';
import { createContext, ReactNode, useContext, useState } from 'react';

interface IConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
}

interface IConfirmContextType {
  openConfirmDialog: (options: IConfirmOptions) => void;
}

const ConfirmDialogContext = createContext<IConfirmContextType | null>(null);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<IConfirmOptions>({});

  const openConfirmDialog = (options: IConfirmOptions) => {
    setVisible(true);
    setOptions(options);
  };

  const handleConfirm = async () => {
    if (options.onConfirm) {
      setLoading(true);
      await options.onConfirm();
      setLoading(false);
    }

    setVisible(false);
  };

  return (
    <ConfirmDialogContext.Provider value={{ openConfirmDialog }}>
      {children}

      <ConfirmDialog
        visible={visible}
        onDismiss={() => setVisible(false)}
        onConfirm={handleConfirm}
        loading={loading}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
      />
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);

  if (!context) {
    throw new Error(
      'useConfirmDialog deve ser usado dentro do ConfirmProvider',
    );
  }

  return context;
}
