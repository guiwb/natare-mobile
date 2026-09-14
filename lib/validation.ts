import { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { z } from 'zod';

export const NAME_MAX_LENGTH = 255;

export const EMAIL_MAX_LENGTH = 255;

export const PASSWORD_MIN_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type TPasswordRequirement = {
  label: string;
  test: (password: string) => boolean;
};

type TApiError = {
  response?: { data?: { errors?: Record<string, string[]> } };
};

export const PASSWORD_REQUIREMENTS: TPasswordRequirement[] = [
  {
    label: `Mínimo de ${PASSWORD_MIN_LENGTH} caracteres`,
    test: (password) => password.length >= PASSWORD_MIN_LENGTH,
  },
  { label: 'Uma letra maiúscula', test: (password) => /\p{Lu}/u.test(password) },
  { label: 'Uma letra minúscula', test: (password) => /\p{Ll}/u.test(password) },
  { label: 'Um número', test: (password) => /\p{N}/u.test(password) },
];

export function passwordScore(password: string): number {
  return PASSWORD_REQUIREMENTS.filter(({ test }) => test(password)).length;
}

export function passwordError(password: string): string | null {
  const missing = PASSWORD_REQUIREMENTS.filter(({ test }) => !test(password));

  if (missing.length === 0) return null;

  return `A senha precisa ter: ${missing
    .map(({ label }) => label.toLowerCase())
    .join(', ')}.`;
}

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email obrigatório')
  .max(EMAIL_MAX_LENGTH, `Máximo ${EMAIL_MAX_LENGTH} caracteres`)
  .regex(EMAIL_PATTERN, 'Email inválido');

export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Nome obrigatório')
  .max(NAME_MAX_LENGTH, `Máximo ${NAME_MAX_LENGTH} caracteres`);

export const newPasswordSchema = z.string().superRefine((password, ctx) => {
  const message = passwordError(password);

  if (message) ctx.addIssue({ code: 'custom', message });
});

export function isNetworkError(error: unknown): boolean {
  return !(error as TApiError)?.response;
}

export function applyApiFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: Record<string, Path<T>>,
): boolean {
  const errors = (error as TApiError)?.response?.data?.errors;

  if (!errors) return false;

  let applied = false;

  for (const [apiField, field] of Object.entries(fields)) {
    const message = errors[apiField]?.[0];

    if (message) {
      setError(field, { message });
      applied = true;
    }
  }

  return applied;
}
