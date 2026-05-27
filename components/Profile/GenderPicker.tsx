import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Modal } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

const OPTIONS = ['Masculino', 'Feminino', 'Prefiro não responder', 'Outro'];

export function GenderPicker({ control }: { control: Control<any> }) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name="gender"
      render={({ field: { value, onChange } }) => (
        <>
          <TextInput
            mode="outlined"
            label="Gênero"
            value={value ?? ''}
            editable={false}
            onPressIn={() => setVisible(true)}
            right={
              <TextInput.Icon
                icon="chevron-down"
                onPress={() => setVisible(true)}
              />
            }
          />

          <Modal visible={visible} transparent animationType="fade">
            <Overlay onPress={() => setVisible(false)}>
              <PickerSheet>
                <PickerHeader>
                  <PickerLabel>Gênero</PickerLabel>
                  <DoneButton onPress={() => setVisible(false)}>
                    <DoneText style={{ color: theme.colors.primary }}>
                      Confirmar
                    </DoneText>
                  </DoneButton>
                </PickerHeader>

                <Picker
                  selectedValue={value ?? OPTIONS[0]}
                  onValueChange={onChange}
                  style={{ color: theme.colors.onSurface }}
                >
                  {OPTIONS.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </PickerSheet>
            </Overlay>
          </Modal>
        </>
      )}
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
