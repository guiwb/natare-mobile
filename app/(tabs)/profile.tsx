import { ProfileAvatar } from '@/components/Profile/Avatar';
import { DangerZone } from '@/components/Profile/DangerZone';
import { PersonalDetailsForm } from '@/components/Profile/PersonalDetailsForm';
import { PreferencesSection } from '@/components/Profile/PreferencesSection';
import { UIScreen } from '@/components/UI/Screen';
import { useAuth } from '@/contexts/AuthProvider';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import { IUser } from '@/services/auth.service';
import CloudinaryService from '@/services/cloudinary.service';
import UserService from '@/services/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
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
  const [pendingLocalUri, setPendingLocalUri] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);

  const handleImageChange = (uri: string) => {
    setPendingLocalUri(uri);
    setRemoved(false);
  };

  const handleRemove = () => {
    setPendingLocalUri(null);
    setAvatarUri(null);
    setRemoved(true);
  };

  const { control, setValue, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setAvatarUri(user.profile_picture ?? null);
      setRemoved(false);
    }
  }, [user, setValue]);

  const onSave = handleSubmit(async (data) => {
    Keyboard.dismiss();
    try {
      setLoading(true);
      let profilePicture = user?.profile_picture;

      if (removed) {
        profilePicture = '';
      }

      if (pendingLocalUri) {
        profilePicture = await CloudinaryService.uploadImage(
          pendingLocalUri,
          'profiles',
        );
        setPendingLocalUri(null);
      }

      const updatedUser = {
        ...user,
        name: data.name,
        profile_picture: profilePicture,
      } as IUser;
      await UserService.updateProfile(updatedUser);
      setUser(updatedUser);
      setAvatarUri(profilePicture ?? null);
      setRemoved(false);
      snack('Perfil atualizado com sucesso');
    } catch {
      snack('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  });

  return (
    <UIScreen
      header={<ScreenTitle>Perfil</ScreenTitle>}
      keyboardShouldPersistTaps="handled"
    >
      <AvatarBlock>
        <ProfileAvatar
          uri={pendingLocalUri ?? avatarUri}
          name={user?.name}
          onImageChange={handleImageChange}
          onRemove={handleRemove}
        />
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
    </UIScreen>
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
