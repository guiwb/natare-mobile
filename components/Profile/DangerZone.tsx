import { UICard } from '@/components/UI/Card';
import { useAuth } from '@/contexts/AuthProvider';
import { useTheme } from 'react-native-paper';
import { ProfileRow } from './ProfileRow';
import styled from 'styled-components/native';

export function DangerZone() {
  const { logout } = useAuth();
  const theme = useTheme();

  return (
    <Section>
      <SectionTitle>Zona de perigo</SectionTitle>
      <UICard>
        <Rows>
          <ProfileRow
            icon="logout"
            title="Sair da conta"
            onPress={logout}
          />

          <Divider />

          <ProfileRow
            icon="delete-outline"
            iconColor="red"
            title="Excluir conta"
            titleColor={theme.colors.error}
            subtitle="Remover permanentemente seus dados"
          />
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
  color: ${({ theme }) => theme.colors.error};
  text-transform: uppercase;
`;

const Rows = styled.View`
  gap: 16px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.outline};
`;
