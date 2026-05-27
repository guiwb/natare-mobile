import { UIButton } from '@/components/UI/Button';
import { UICard } from '@/components/UI/Card';
import { UIFormInput } from '@/components/UI/FormInput';
import { BirthDatePicker } from './BirthDatePicker';
import { GenderPicker } from './GenderPicker';
import { Control } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
import styled from 'styled-components/native';

type Props = {
  control: Control<any>;
  email?: string;
  onSave: () => void;
  loading?: boolean;
};

export function PersonalDetailsForm({ control, email, onSave, loading }: Props) {
  return (
    <Section>
      <SectionTitle>Detalhes pessoais</SectionTitle>
      <UICard>
        <Fields>
          <UIFormInput
            control={control}
            name="name"
            label="Nome completo"
            mode="outlined"
            autoCapitalize="words"
          />

          <TextInput
            mode="outlined"
            label="E-mail"
            value={email}
            editable={false}
            disabled
          />

          <BirthDatePicker control={control} />

          <GenderPicker control={control} />

          <Row>
            <Half>
              <UIFormInput
                control={control}
                name="weight"
                label="Peso"
                mode="outlined"
                keyboardType="numeric"
                right={<TextInput.Affix text="kg" />}
              />
            </Half>
            <Half>
              <UIFormInput
                control={control}
                name="height"
                label="Altura"
                mode="outlined"
                keyboardType="numeric"
                right={<TextInput.Affix text="cm" />}
              />
            </Half>
          </Row>

          <UIButton
            text={loading ? 'Salvando...' : 'Salvar alterações'}
            onPress={onSave}
          />
        </Fields>
      </UICard>
    </Section>
  );
}

const Section = styled.View`
  gap: 10px;
`;

const SectionTitle = styled.Text`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
  text-transform: uppercase;
`;

const Fields = styled.View`
  gap: 14px;
`;

const Row = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const Half = styled.View`
  flex: 1;
`;
