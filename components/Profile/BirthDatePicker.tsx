import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Modal, Platform } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}

export function BirthDatePicker({ control }: { control: Control<any> }) {
  const theme = useTheme();
  const [iosPickerVisible, setIosPickerVisible] = useState(false);

  return (
    <Controller
      control={control}
      name="birthDate"
      render={({ field: { value, onChange } }) => {
        const date: Date = value instanceof Date ? value : new Date(2000, 0, 1);

        const openAndroid = () => {
          DateTimePickerAndroid.open({
            value: date,
            mode: 'date',
            maximumDate: new Date(),
            onChange: (_, selected) => {
              if (selected) onChange(selected);
            },
          });
        };

        return (
          <>
            <TextInput
              mode="outlined"
              label="Data de nascimento"
              value={value instanceof Date ? formatDate(value) : ''}
              editable={false}
              onPressIn={
                Platform.OS === 'android'
                  ? openAndroid
                  : () => setIosPickerVisible(true)
              }
              right={
                <TextInput.Icon
                  icon="calendar"
                  onPress={
                    Platform.OS === 'android'
                      ? openAndroid
                      : () => setIosPickerVisible(true)
                  }
                />
              }
            />

            {Platform.OS === 'ios' && (
              <Modal
                visible={iosPickerVisible}
                transparent
                animationType="fade"
              >
                <Overlay>
                  <PickerSheet>
                    <PickerHeader>
                      <PickerLabel>Data de nascimento</PickerLabel>
                      <DoneButton onPress={() => setIosPickerVisible(false)}>
                        <DoneText style={{ color: theme.colors.primary }}>
                          Confirmar
                        </DoneText>
                      </DoneButton>
                    </PickerHeader>

                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="spinner"
                      maximumDate={new Date()}
                      locale="pt-BR"
                      onChange={(_, selected) => {
                        if (selected) onChange(selected);
                      }}
                      style={{ width: '100%' }}
                    />
                  </PickerSheet>
                </Overlay>
              </Modal>
            )}
          </>
        );
      }}
    />
  );
}

const Overlay = styled.Pressable`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const PickerSheet = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 16px;
  padding-bottom: 40px;
`;

const PickerHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PickerLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const DoneButton = styled.Pressable`
  padding: 8px;
`;

const DoneText = styled.Text`
  font-size: 15px;
  font-weight: 700;
`;
