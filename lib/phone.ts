const DEFAULT_COUNTRY_CODE = '55';

const MOBILE_LENGTH = 11;

const LANDLINE_LENGTH = 10;

export const digitsOnly = (value?: string | null) =>
  String(value ?? '').replace(/\D/g, '');

export function phoneDigits(value?: string | null): string {
  const digits = digitsOnly(value);

  if (digits.startsWith(DEFAULT_COUNTRY_CODE) && digits.length > MOBILE_LENGTH)
    return digits.slice(
      DEFAULT_COUNTRY_CODE.length,
      DEFAULT_COUNTRY_CODE.length + MOBILE_LENGTH,
    );

  return digits.slice(0, MOBILE_LENGTH);
}

export function maskPhone(value?: string | null): string {
  const digits = phoneDigits(value);

  if (digits.length === 0) return '';

  if (digits.length <= 2) return `(${digits}`;

  const area = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (rest.length <= 4) return `(${area}) ${rest}`;

  const split = digits.length === MOBILE_LENGTH ? 5 : 4;

  return `(${area}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}

export function isValidPhone(value?: string | null): boolean {
  const length = phoneDigits(value).length;

  return length === LANDLINE_LENGTH || length === MOBILE_LENGTH;
}
