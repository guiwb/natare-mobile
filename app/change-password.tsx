import { UIButton } from '@/components/UI/Button';
import { UIFormInput } from '@/components/UI/FormInput';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, ScrollView } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { z } from 'zod';

const schema = z
  .object({
    currentPassword: z.string().min(6, 'Mínimo 6 caracteres'),
    newPassword:     z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { snack } = useSnackbar();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async () => {
    Keyboard.dismiss();
    try {
      setLoading(true);
      // TODO: chamar endpoint de troca de senha
      snack('Senha alterada com sucesso');
      router.back();
    } catch {
      snack('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  });

  return (
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
          <Icon source="arrow-left" size={22} color={theme.colors.onSurface} />
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
      <UIFormInput
        control={control}
        name="confirmPassword"
        label="Confirmar nova senha"
        mode="outlined"
        secureTextEntry
      />

      <UIButton
        text={loading ? 'Salvando...' : 'Alterar senha'}
        onPress={onSubmit}
      />
    </ScrollView>
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
