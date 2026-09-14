import { ProfileAvatar } from '@/components/Profile/Avatar';
import { DangerZone } from '@/components/Profile/DangerZone';
import { PersonalDetailsForm } from '@/components/Profile/PersonalDetailsForm';
import { PreferencesSection } from '@/components/Profile/PreferencesSection';
import { UIScreen } from '@/components/UI/Screen';
import { UIUserHeader } from '@/components/UI/UserHeader';
import { MIN_BIRTH_DATE, maxBirthDate } from '@/constants/profile';
import { useAuth } from '@/contexts/AuthProvider';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import AuthService from '@/services/auth.service';
import CloudinaryService from '@/services/cloudinary.service';
import UserService, { TGender } from '@/services/user.service';
import { isValidPhone, maskPhone, phoneDigits } from '@/lib/phone';
import {
  applyApiFieldErrors,
  isNetworkError,
  nameSchema,
} from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useRefresh } from '@/hooks/useRefresh';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import styled from 'styled-components/native';
import { z } from 'zod';

const startOfDay = (date: Date) => dayjs(date).startOf('day').valueOf();

const optionalMeasure = (min: number, max: number, message: string) =>
  z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const parsed = Number(value.replace(',', '.'));
        return Number.isFinite(parsed) && parsed >= min && parsed <= max;
      },
      { message },
    );

const schema = z.object({
  name: nameSchema,
  birthDate: z
    .date()
    .optional()
    .refine((value) => !value || startOfDay(value) >= MIN_BIRTH_DATE.getTime(), {
      message: 'A data deve ser posterior a 01/01/1900',
    })
    .refine((value) => !value || startOfDay(value) <= maxBirthDate().getTime(), {
      message: 'A data de nascimento deve ser anterior a hoje',
    }),
  gender: z.string().optional(),
  weight: optionalMeasure(20, 300, 'Peso deve estar entre 20 e 300 kg'),
  height: optionalMeasure(50, 250, 'Altura deve estar entre 50 e 250 cm'),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || isValidPhone(value), {
      message: 'Celular inválido. Informe DDD e número.',
    }),
});

const toMeasure = (value?: string) =>
  value ? Number(value.replace(',', '.')) : null;

export default function ProfileScreen() {
  const { user, setUser } = useAuth();
  const { snack } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const persistPicture = async (profilePicture: string) => {
    if (!user) return;
    setAvatarLoading(true);
    try {
      await UserService.updateProfile(user.id, {
        profile_picture: profilePicture,
      });
      setUser({ ...user, profile_picture: profilePicture });
      setAvatarUri(profilePicture || null);
      snack('Foto atualizada');
    } catch (error) {
      console.warn('Falha ao salvar a foto de perfil:', error);
      setAvatarUri(user.profile_picture ?? null);
      snack('Erro ao atualizar foto');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleImageChange = async (uri: string) => {
    setAvatarUri(uri);
    setAvatarLoading(true);
    try {
      const url = await CloudinaryService.uploadImage(uri, 'profiles');
      await persistPicture(url);
    } catch (error) {
      console.warn('Falha ao enviar a imagem para o Cloudinary:', error);
      setAvatarUri(user?.profile_picture ?? null);
      setAvatarLoading(false);
      snack('Erro ao enviar imagem');
    }
  };

  const handleRemove = () => persistPicture('');

  const { control, setValue, handleSubmit, setError } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!user) return;

    setValue('name', user.name);
    setValue('phone', maskPhone(user.phone));
    setValue('gender', user.gender ?? '');
    setValue('weight', user.weight == null ? '' : String(user.weight));
    setValue('height', user.height == null ? '' : String(user.height));
    setValue(
      'birthDate',
      user.birth_date ? new Date(`${user.birth_date}T00:00:00`) : undefined,
    );
    setAvatarUri(user.profile_picture ?? null);
  }, [user, setValue]);

  const { refreshing, onRefresh } = useRefresh(async () => {
    try {
      setUser(await AuthService.getCurrentUser());
    } catch {
      snack('Erro ao atualizar o perfil');
    }
  });

  const onSave = handleSubmit(async (data) => {
    Keyboard.dismiss();
    if (!user) return;

    const payload = {
      name: data.name,
      phone: phoneDigits(data.phone) || null,
      gender: (data.gender || null) as TGender | null,
      weight: toMeasure(data.weight),
      height: toMeasure(data.height),
      birth_date: data.birthDate
        ? dayjs(data.birthDate).format('YYYY-MM-DD')
        : null,
    };

    try {
      setLoading(true);
      const updated = await UserService.updateProfile(user.id, payload);
      setUser({ ...user, ...updated });
      snack('Perfil atualizado com sucesso');
    } catch (error) {
      const handled = applyApiFieldErrors(error, setError, {
        name: 'name',
        phone: 'phone',
        gender: 'gender',
        weight: 'weight',
        height: 'height',
        birth_date: 'birthDate',
      });

      if (!handled) {
        snack(
          isNetworkError(error)
            ? 'Não foi possível conectar ao servidor. Verifique sua conexão.'
            : 'Erro ao atualizar perfil',
        );
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <UIScreen
      header={<UIUserHeader title="Perfil" showAvatar={false} />}
      keyboardShouldPersistTaps="handled"
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      <AvatarBlock>
        <ProfileAvatar
          uri={avatarUri}
          name={user?.name}
          loading={avatarLoading}
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
