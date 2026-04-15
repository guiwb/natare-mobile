import { useAuth } from '@/contexts/AuthProvider';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export default function HomeScreen() {
  const { logout, user } = useAuth();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">Olá, seja bem-vindo {user?.name}!</Text>
      <Button
        mode="contained"
        buttonColor={theme.colors.errorContainer}
        textColor={theme.colors.onErrorContainer}
        icon="logout"
        onPress={logout}
      >
        Sair
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
