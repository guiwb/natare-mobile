import { ProfileAvatar } from '@/components/Profile/Avatar';
import { DangerZone } from '@/components/Profile/DangerZone';
import { PersonalDetailsForm } from '@/components/Profile/PersonalDetailsForm';
import { PreferencesSection } from '@/components/Profile/PreferencesSection';
import { useAuth } from '@/contexts/AuthProvider';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import { IUser } from '@/services/auth.service';
import UserService from '@/services/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import styled from 'styled-components/native';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  birthDate: z.date().optional(),
  gender: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
});

export default function ProfileScreen() {
  const { user, setUser } = useAuth();
  const { snack } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const { control, setValue, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setAvatarUri(user.profile_picture ?? null);
    }
  }, [user, setValue]);

  const onSave = handleSubmit(async (data) => {
    Keyboard.dismiss();
    try {
      setLoading(true);
      const updatedUser = { ...user, name: data.name } as IUser;
      await UserService.updateProfile(updatedUser);
      setUser(updatedUser);
      snack('Perfil atualizado com sucesso');
    } catch {
      snack('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        gap: 24,
        paddingBottom: 120,
        paddingHorizontal: 24,
        paddingTop: 60,
      }}
    >
      <ScreenTitle>Perfil</ScreenTitle>

      <AvatarBlock>
        <ProfileAvatar uri={avatarUri} onImageChange={setAvatarUri} />
        <UserName>{user?.name}</UserName>
        <UserEmail>{user?.email}</UserEmail>
      </AvatarBlock>

      <PersonalDetailsForm
        control={control}
        email={user?.email}
        onSave={onSave}
        loading={loading}
      />

      <PreferencesSection />

      <DangerZone />
    </ScrollView>
  );
}

const ScreenTitle = styled(Text)`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const AvatarBlock = styled.View`
  align-items: center;
  gap: 6px;
`;

const UserName = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const UserEmail = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;
