import { UIButton } from '@/components/UI/Button';
import { UIFormInput } from '@/components/UI/FormInput';
import { useAuth } from '@/contexts/AuthProvider';
import { useConfirmDialog } from '@/contexts/ConfirmDialogProvider';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, ScrollView } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { z } from 'zod';

const schema = z.object({
  password: z.string().min(1, 'Informe sua senha'),
});

const CONSEQUENCES = [
  'Seus dados pessoais (nome, e-mail e foto) são apagados',
  'Você sai de todas as equipes das quais participa',
  'Você perde o acesso ao aplicativo imediatamente',
];

export default function DeleteAccountScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { snack } = useSnackbar();
  const { deleteAccount } = useAuth();
  const { openConfirmDialog } = useConfirmDialog();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const confirmDeletion = async (password: string) => {
    setLoading(true);
    try {
      await deleteAccount(password);
      snack('Sua conta foi excluída.');
    } catch (error: any) {
      if (error?.response?.status === 422) {
        snack('Senha incorreta.');
        return;
      }

      if (!error?.response) {
        snack('Não foi possível conectar ao servidor. Verifique sua conexão.');
        return;
      }

      snack('Não foi possível excluir a conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit(({ password }) => {
    Keyboard.dismiss();

    openConfirmDialog({
      title: 'Excluir conta',
      message:
        'Esta ação é irreversível. Sua conta e seus dados pessoais serão excluídos e não poderão ser recuperados.',
      confirmText: 'Excluir conta',
      cancelText: 'Cancelar',
      onConfirm: () => confirmDeletion(password),
    });
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
        <ScreenTitle>Excluir conta</ScreenTitle>
      </Header>

      <Warning>
        <WarningTitle>Esta ação é irreversível</WarningTitle>
        {CONSEQUENCES.map((item) => (
          <WarningItem key={item}>{`•  ${item}`}</WarningItem>
        ))}
      </Warning>

      <Description>
        Para continuar, confirme sua senha atual.
      </Description>

      <UIFormInput
        control={control}
        name="password"
        label="Senha atual"
        mode="outlined"
        secureTextEntry
      />

      <UIButton
        text="Excluir minha conta"
        loading={loading}
        onPress={onSubmit}
        style={{ backgroundColor: theme.colors.error }}
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

const Warning = styled.View`
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.errorContainer};
`;

const WarningTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.error};
`;

const WarningItem = styled.Text`
  font-size: 13px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Description = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;
