import { createContext, useContext, useState } from 'react';
import { Snackbar } from 'react-native-paper';

type SnackbarContextType = {
  snack: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
  snack: () => {},
});

export const SnackbarProvider = ({ children }: any) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

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
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
