import { useAuth } from '@/contexts/AuthProvider';
import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      gap: 8
    }
  });

export default function Login() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
     return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput label="E-mail" />
      <TextInput label="Senha" />
      <Button mode="contained" onPress={() => {}}>
        Entrar
      </Button>
    </SafeAreaView>
  );
}
