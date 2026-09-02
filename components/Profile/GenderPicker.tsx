import { UIOptionSheet } from '@/components/UI/OptionSheet';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { TextInput } from 'react-native-paper';

const OPTIONS = ['Masculino', 'Feminino', 'Prefiro não responder', 'Outro'];

export function GenderPicker({ control }: { control: Control<any> }) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name="gender"
      render={({ field: { value, onChange } }) => (
        <>
          <Pressable onPress={() => setVisible(true)}>
            <View pointerEvents="none">
              <TextInput
                mode="outlined"
                label="Gênero"
                value={value ?? ''}
                editable={false}
                right={<TextInput.Icon icon="chevron-down" />}
              />
            </View>
          </Pressable>

          <UIOptionSheet
            visible={visible}
            title="Gênero"
            options={OPTIONS}
            value={value}
            onSelect={onChange}
            onDismiss={() => setVisible(false)}
          />
        </>
      )}
    />
  );
}
