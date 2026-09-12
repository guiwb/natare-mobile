import { UIButton } from '@/components/UI/Button';
import { UICard } from '@/components/UI/Card';
import {
  PROFILE_FIELD_LABELS,
  ProfileRequiredField,
  missingProfileFields,
} from '@/constants/profile';
import { useAuth } from '@/contexts/AuthProvider';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import styled from 'styled-components/native';

const storageKey = (userId: string) => `missing_profile_dismissed_${userId}`;

function humanize(fields: ProfileRequiredField[]): string {
  const labels = fields.map((field) => PROFILE_FIELD_LABELS[field]);

  if (labels.length === 1) return labels[0];

  return `${labels.slice(0, -1).join(', ')} e ${labels[labels.length - 1]}`;
}

export function MissingProfileBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState<string | null>(null);
  const missing = missingProfileFields(user);
  const signature = missing.join(',');

  useEffect(() => {
    if (!user) return;

    getItemAsync(storageKey(user.id))
      .then((value) => setDismissed(value ?? ''))
      .catch(() => setDismissed(''));
  }, [user]);

  const dismiss = () => {
    if (!user) return;
    setDismissed(signature);
    setItemAsync(storageKey(user.id), signature).catch(() => {});
  };

  if (!user || missing.length === 0) return null;
  if (dismissed === null || dismissed === signature) return null;

  return (
    <UICard>
      <Content>
        <Title>Complete o seu perfil</Title>
        <Description>Faltam {humanize(missing)}.</Description>
        <Actions>
          <UIButton text="Preencher" onPress={() => router.push('/profile')} />
          <DismissButton onPress={dismiss}>
            <DismissLabel>Depois</DismissLabel>
          </DismissButton>
        </Actions>
      </Content>
    </UICard>
  );
}

const Content = styled.View`
  gap: 6px;
`;

const Title = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Description = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const Actions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
`;

const DismissButton = styled.Pressable`
  padding: 10px 14px;
`;

const DismissLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;
