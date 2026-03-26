import { DismissKeyboard } from '@/components/DismissKeyboard';
import { FormInput } from '@/components/UI/FormInput';
import { useAuth } from '@/contexts/AuthProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    gap: 16,
    width: '90%',
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async ({ email, password }: any) => {
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  const schema = z.object({
    email: z
      .string()
      .min(1, 'Email obrigatório')
      .refine((val) => /\S+@\S+\.\S+/.test(val), {
        message: 'Email inválido',
      }),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
  });

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <Image
          source={require('@/assets/images/logo.svg')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />

        <FormInput
          control={control}
          name="email"
          label="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          mode="outlined"
        />

        <FormInput
          control={control}
          name="password"
          label="Senha"
          secureTextEntry
          mode="outlined"
        />

        <Button
          mode="contained"
          loading={isLoading}
          onPress={handleSubmit(handleLogin)}
        >
          Entrar
        </Button>
      </SafeAreaView>
    </DismissKeyboard>
  );
}
