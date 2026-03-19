import { useAuth } from '@/contexts/AuthProvider';
import { Redirect } from 'expo-router';
import { useState } from 'react';
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
  const { user, isLoading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isLoading) {
     return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput label="E-mail" value={email} onChangeText={setEmail} />
      <TextInput label="Senha" value={password} onChangeText={setPassword} />

      <Button mode="contained" loading={isLoading} onPress={() => login(email, password)}>
        Entrar
      </Button>
    </SafeAreaView>
  );
}
