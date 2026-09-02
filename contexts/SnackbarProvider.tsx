import { createContext, useContext, useState } from 'react';
import { Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SnackbarContextType = {
  snack: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
  snack: () => {},
});

export const SnackbarProvider = ({ children }: any) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const insets = useSafeAreaInsets();

  const snack = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };

  return (
    <SnackbarContext.Provider value={{ snack }}>
      {children}

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        wrapperStyle={{ top: insets.top, bottom: undefined }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
