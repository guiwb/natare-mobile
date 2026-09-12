import { UIFieldError } from '@/components/UI/FieldError';
import { UISheet } from '@/components/UI/Sheet';
import { MIN_BIRTH_DATE, maxBirthDate } from '@/constants/profile';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Platform, Pressable, View } from 'react-native';
import { TextInput } from 'react-native-paper';

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}

export function BirthDatePicker({ control }: { control: Control<any> }) {
  const [iosPickerVisible, setIosPickerVisible] = useState(false);

  return (
    <Controller
      control={control}
      name="birthDate"
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const date: Date = value instanceof Date ? value : new Date(2000, 0, 1);
        const maximumDate = maxBirthDate();

        const openAndroid = () => {
          DateTimePickerAndroid.open({
            value: date,
            mode: 'date',
            maximumDate,
            minimumDate: MIN_BIRTH_DATE,
            onValueChange: (_, selected) => onChange(selected),
          });
        };

        const open =
          Platform.OS === 'android'
            ? openAndroid
            : () => setIosPickerVisible(true);

        return (
          <>
            {/* the input is disabled, so the whole row is tappable through
                a Pressable instead of the input's own touch handlers */}
            <Pressable onPress={open}>
              <View pointerEvents="none">
                <TextInput
                  mode="outlined"
                  label="Data de nascimento"
                  value={value instanceof Date ? formatDate(value) : ''}
                  editable={false}
                  error={!!error}
                  right={<TextInput.Icon icon="calendar" />}
                />
              </View>
            </Pressable>

            <UIFieldError message={error?.message} />

            {Platform.OS === 'ios' && (
              <UISheet
                visible={iosPickerVisible}
                title="Data de nascimento"
                doneLabel="Confirmar"
                onDismiss={() => setIosPickerVisible(false)}
              >
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  maximumDate={maximumDate}
                  minimumDate={MIN_BIRTH_DATE}
                  locale="pt-BR"
                  onValueChange={(_, selected) => onChange(selected)}
                  style={{ width: '100%' }}
                />
              </UISheet>
            )}
          </>
        );
      }}
    />
  );
}
