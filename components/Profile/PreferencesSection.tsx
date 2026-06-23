import { UICard } from '@/components/UI/Card';
import { useAuth } from '@/contexts/AuthProvider';
import { ProfileRow } from './ProfileRow';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Switch } from 'react-native-paper';
import styled from 'styled-components/native';

export function PreferencesSection() {
  const router = useRouter();
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <Section>
      <SectionTitle>Preferências</SectionTitle>
      <UICard>
        <Rows>
          <ProfileRow
            icon="bell-outline"
            title="Notificações push"
            subtitle="Lembretes e atualizações de treino"
            right={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            }
          />

          <Divider />

          <ProfileRow
            icon="lock-outline"
            title="Alterar senha"
            onPress={() => router.push('/change-password')}
          />

          <Divider />

          <ProfileRow icon="logout" title="Sair da conta" onPress={logout} />
        </Rows>
      </UICard>
    </Section>
  );
}

const Section = styled.View`
  gap: 10px;
`;

const SectionTitle = styled.Text`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
  text-transform: uppercase;
`;

const Rows = styled.View`
  gap: 16px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.outline};
`;
