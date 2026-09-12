import { UISheet } from '@/components/UI/Sheet';
import { GENDER_LABELS, GENDER_OPTIONS } from '@/constants/profile';
import { TGender } from '@/services/user.service';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';



export function GenderPicker({ control }: { control: Control<any> }) {
  const theme = useTheme();
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <Controller
      control={control}
      name="gender"
      render={({ field: { value, onChange } }) => {
        const field = (
          <View pointerEvents="none">
            <TextInput
              mode="outlined"
              label="Gênero"
              value={value ? (GENDER_LABELS[value as TGender] ?? '') : ''}
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
            />
          </View>
        );

        const items = [
          <Picker.Item key="empty" label="Selecione" value="" />,
          ...GENDER_OPTIONS.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          )),
        ];

        // Android opens its own dropdown from the picker view, so it sits
        // invisible on top of the field and takes the tap
        if (Platform.OS === 'android') {
          return (
            <View>
              {field}
              <Picker
                mode="dropdown"
                selectedValue={value ?? ''}
                onValueChange={(option) => option && onChange(option)}
                style={[StyleSheet.absoluteFill, { opacity: 0 }]}
              >
                {items}
              </Picker>
            </View>
          );
        }

        return (
          <>
            <Pressable onPress={() => setSheetVisible(true)}>{field}</Pressable>

            <UISheet
              visible={sheetVisible}
              title="Gênero"
              doneLabel="Confirmar"
              onDismiss={() => setSheetVisible(false)}
            >
              <Picker
                selectedValue={value ?? ''}
                onValueChange={(option) => option && onChange(option)}
                itemStyle={{ color: theme.colors.onSurface }}
              >
                {items}
              </Picker>
            </UISheet>
          </>
        );
      }}
    />
  );
}
