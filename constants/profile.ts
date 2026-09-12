import { IUser, TGender } from '@/services/user.service';

export const GENDER_LABELS: Record<TGender, string> = {
  MALE: 'Masculino',
  FEMALE: 'Feminino',
  OTHER: 'Outro',
  PREFER_NOT_TO_SAY: 'Prefiro não responder',
};

export const GENDER_OPTIONS = (
  Object.keys(GENDER_LABELS) as TGender[]
).map((value) => ({ value, label: GENDER_LABELS[value] }));

export const MIN_BIRTH_DATE = new Date(1900, 0, 1);

export function maxBirthDate(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - 1);
  return date;
}

export const PROFILE_REQUIRED_FIELDS = [
  'birth_date',
  'weight',
  'height',
  'phone',
] as const;

export type ProfileRequiredField = (typeof PROFILE_REQUIRED_FIELDS)[number];

export const PROFILE_FIELD_LABELS: Record<ProfileRequiredField, string> = {
  birth_date: 'data de nascimento',
  weight: 'peso',
  height: 'altura',
  phone: 'celular',
};

export function missingProfileFields(
  user?: Partial<IUser> | null,
): ProfileRequiredField[] {
  if (!user) return [];

  return PROFILE_REQUIRED_FIELDS.filter((field) => !user[field]);
}
