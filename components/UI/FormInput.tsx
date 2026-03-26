import React, { ComponentProps } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Text, TextInput } from 'react-native-paper';

type TParams = {
  control: Control<any>;
  name: string;
  label: string;
} & Omit<ComponentProps<typeof TextInput>, 'value' | 'onChangeText'>;

export function FormInput({ control, name, label, ...props }: TParams) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <TextInput
            label={label}
            value={value}
            onChangeText={onChange}
            error={!!error}
            {...props}
          />
          {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
        </>
      )}
    />
  );
}
