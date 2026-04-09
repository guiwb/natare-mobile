import { DismissKeyboard } from '@/components/DismissKeyboard';
import { FormInput } from '@/components/UI/FormInput';
import { useAuth } from '@/contexts/AuthProvider';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
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

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { snack } = useSnackbar();
  const router = useRouter();

  const send = async ({ email, password }: any) => {
    setIsLoading(true);
    await forgotPassword(email);
    setIsLoading(false);
    snack('Um link de redefinição foi enviado para o seu e-mail!');
    router.push('/login');
  };

  const schema = z.object({
    email: z
      .string()
      .min(1, 'Email obrigatório')
      .refine((val) => /\S+@\S+\.\S+/.test(val), {
        message: 'Email inválido',
      }),
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

        <Text>Recuperação de senha</Text>

        <FormInput
          control={control}
          name="email"
          label="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          mode="outlined"
        />

        <Button
          mode="contained"
          loading={isLoading}
          onPress={handleSubmit(send)}
        >
          Receber e-mail de recuperação
        </Button>

        <Button
          mode="text"
          disabled={isLoading}
          onPress={() => router.push('/login')}
        >
          Entrar com a minha conta
        </Button>
      </SafeAreaView>
    </DismissKeyboard>
  );
}
