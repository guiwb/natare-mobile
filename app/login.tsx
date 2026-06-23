import { AuthCard } from '@/components/Auth/AuthCard';
import { AuthChip } from '@/components/Auth/AuthChip';
import { DismissKeyboard } from '@/components/DismissKeyboard';
import { UIButton } from '@/components/UI/Button';
import { UIFormInput } from '@/components/UI/FormInput';
import { useAuth } from '@/contexts/AuthProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Linking } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { z } from 'zod';

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email obrigatório')
    .refine((val) => /\S+@\S+\.\S+/.test(val), { message: 'Email inválido' }),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  const handleLogin = async ({ email, password }: any) => {
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <StyledScreen>
      <DismissKeyboard>
        <StyledCenter edges={['top', 'bottom']}>
          <AuthCard>
            <AuthChip icon="lock-outline">Acesso seguro</AuthChip>

            <StyledTitle>Bem-vindo de volta</StyledTitle>
            <StyledSubtitle>
              Entre para ver seus próximos treinos e acompanhar sua evolução.
            </StyledSubtitle>

            <UIFormInput
              control={control}
              name="email"
              label="E-mail"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              mode="outlined"
              left={<TextInput.Icon icon="email-outline" />}
            />

            <UIFormInput
              control={control}
              name="password"
              label="Senha"
              placeholder="Informe sua senha"
              secureTextEntry
              mode="outlined"
              left={<TextInput.Icon icon="lock-outline" />}
            />

            <StyledForgotRow>
              <StyledLink onPress={() => router.push('/forgot-password')}>
                Esqueceu a senha?
              </StyledLink>
            </StyledForgotRow>

            <UIButton
              text="Entrar na minha conta"
              iconRight="arrow-right"
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              onPress={handleSubmit(handleLogin)}
            />

            <StyledDivider />

            <StyledFooter>
              Precisa de ajuda?{' '}
              <StyledLink
                onPress={() => Linking.openURL('mailto:contato@natare.app')}
              >
                Fale conosco
              </StyledLink>
            </StyledFooter>
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

const StyledForgotRow = styled.View`
  align-items: flex-end;
`;

const StyledLink = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 700;
`;

const StyledDivider = styled.View`
  height: 1px;
  margin-top: 6px;
  background-color: ${({ theme }) => theme.colors.outline};
`;

const StyledFooter = styled.Text`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;
