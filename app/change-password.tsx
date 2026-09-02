import { UIButton } from '@/components/UI/Button';
import { UIFormInput } from '@/components/UI/FormInput';
import { UIPasswordStrength } from '@/components/UI/PasswordStrength';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import AuthService from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { z } from 'zod';

const PASSWORD_MIN_LENGTH = 8;

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Informe sua senha atual'),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Mínimo ${PASSWORD_MIN_LENGTH} caracteres`),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Mínimo ${PASSWORD_MIN_LENGTH} caracteres`),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: 'A nova senha deve ser diferente da atual',
    path: ['newPassword'],
  });

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { snack } = useSnackbar();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = useWatch({ control, name: 'newPassword' });

  const onSubmit = handleSubmit(async ({ currentPassword, newPassword }) => {
    Keyboard.dismiss();
    try {
      setLoading(true);
      await AuthService.updatePassword(currentPassword, newPassword);
      snack('Senha alterada com sucesso');
      router.back();
    } catch (error: any) {
      if (error?.response?.status === 422) {
        const errors = error.response.data?.errors ?? {};

        snack(
          errors.current_password
            ? 'Senha atual incorreta.'
            : 'Confira a nova senha e tente novamente.',
        );
        return;
      }

      if (!error?.response) {
        snack('Não foi possível conectar ao servidor. Verifique sua conexão.');
        return;
      }

      snack('Não foi possível alterar a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          gap: 20,
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 60,
        }}
      >
        <Header>
          <BackButton onPress={() => router.back()}>
            <Icon
              source="arrow-left"
              size={22}
              color={theme.colors.onSurface}
            />
          </BackButton>
          <ScreenTitle>Alterar senha</ScreenTitle>
        </Header>

        <UIFormInput
          control={control}
          name="currentPassword"
          label="Senha atual"
          mode="outlined"
          secureTextEntry
        />
        <UIFormInput
          control={control}
          name="newPassword"
          label="Nova senha"
          mode="outlined"
          secureTextEntry
        />
        <UIPasswordStrength password={newPassword ?? ''} />
        <UIFormInput
          control={control}
          name="confirmPassword"
          label="Confirmar nova senha"
          mode="outlined"
          secureTextEntry
        />

        <UIButton
          text={loading ? 'Salvando...' : 'Alterar senha'}
          loading={loading}
          disabled={loading}
          onPress={onSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.Pressable`
  padding: 4px;
`;

const ScreenTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;
