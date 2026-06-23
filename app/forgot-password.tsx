import { AuthBackground } from '@/components/Auth/AuthBackground';
import { AuthCard } from '@/components/Auth/AuthCard';
import { AuthChip } from '@/components/Auth/AuthChip';
import { DismissKeyboard } from '@/components/DismissKeyboard';
import { UIButton } from '@/components/UI/Button';
import { UIFormInput } from '@/components/UI/FormInput';
import { useAuth } from '@/contexts/AuthProvider';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { z } from 'zod';

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email obrigatório')
    .refine((val) => /\S+@\S+\.\S+/.test(val), { message: 'Email inválido' }),
});

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { snack } = useSnackbar();
  const router = useRouter();
  const theme = useTheme();

  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  const send = async ({ email }: { email: string }) => {
    setIsLoading(true);
    await forgotPassword(email);
    setIsLoading(false);
    snack('Um link de redefinição foi enviado para o seu e-mail!');
    router.push('/login');
  };

  return (
    <StyledScreen>
      <AuthBackground />
      <DismissKeyboard>
        <StyledCenter edges={['top', 'bottom']}>
          <AuthCard>
            <StyledBack onPress={() => router.push('/login')}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <StyledBackText>Voltar ao login</StyledBackText>
            </StyledBack>

            <AuthChip icon="email-outline">Recuperação de senha</AuthChip>

            <StyledTitle>Esqueceu a senha?</StyledTitle>
            <StyledSubtitle>
              Sem problemas, informe o e-mail da sua conta e enviaremos um link
              para você criar uma nova senha em segundos.
            </StyledSubtitle>

            <UIFormInput
              control={control}
              name="email"
              label="E-mail da conta"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              mode="outlined"
              left={<TextInput.Icon icon="email-outline" />}
            />

            <UIButton
              text="Enviar link de recuperação"
              iconLeft="send"
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              onPress={handleSubmit(send)}
            />

            <StyledInfo>
              <MaterialCommunityIcons
                name="information-outline"
                size={16}
                color={theme.colors.primary}
              />
              <StyledInfoText>
                O link expira em <StyledStrong>30 minutos</StyledStrong>. Confira
                sua caixa de entrada e a pasta de spam.
              </StyledInfoText>
            </StyledInfo>
          </AuthCard>
        </StyledCenter>
      </DismissKeyboard>
    </StyledScreen>
  );
}

const StyledScreen = styled.View`
  flex: 1;
`;

const StyledCenter = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
  padding: 24px;
`;

const StyledBack = styled.Pressable`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  gap: 6px;
  margin-bottom: 4px;
`;

const StyledBackText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const StyledTitle = styled.Text`
  margin-top: 6px;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -1px;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const StyledSubtitle = styled.Text`
  font-size: 14px;
  line-height: 21px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const StyledInfo = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  margin-top: 4px;
  padding: 14px;
  border-radius: 12px;
  background-color: rgba(66, 133, 244, 0.1);
  border-width: 1px;
  border-color: rgba(66, 133, 244, 0.4);
`;

const StyledInfoText = styled.Text`
  flex: 1;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const StyledStrong = styled.Text`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;
