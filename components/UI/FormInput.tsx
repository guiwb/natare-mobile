import { UIFieldError } from '@/components/UI/FieldError';
import React, { ComponentProps, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { TextInput } from 'react-native-paper';

type TParams = {
  control: Control<any>;
  name: string;
  label: string;
  mask?: (value: string) => string;
} & Omit<ComponentProps<typeof TextInput>, 'value' | 'onChangeText'>;

export function UIFormInput({
  control,
  name,
  label,
  secureTextEntry,
  right,
  mask,
  ...props
}: TParams) {
  const [visible, setVisible] = useState(false);

  const passwordToggle = secureTextEntry ? (
    <TextInput.Icon
      icon={visible ? 'eye-off' : 'eye'}
      onPress={() => setVisible((v) => !v)}
      accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
    />
  ) : null;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <TextInput
            label={label}
            value={value}
            onChangeText={(text) => onChange(mask ? mask(text) : text)}
            error={!!error}
            secureTextEntry={secureTextEntry && !visible}
            right={right ?? passwordToggle}
            {...props}
          />
          <UIFieldError message={error?.message} />
        </>
      )}
    />
  );
}
