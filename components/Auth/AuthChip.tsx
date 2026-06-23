import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

type Props = {
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  children: string;
};

export function AuthChip({ icon, children }: Props) {
  const theme = useTheme();
  return (
    <StyledChip>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={13}
          color={theme.colors.primary}
        />
      )}
      <StyledLabel>{children}</StyledLabel>
    </StyledChip>
  );
}

const StyledChip = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  background-color: rgba(66, 133, 244, 0.12);
  border-width: 1px;
  border-color: rgba(66, 133, 244, 0.4);
`;

const StyledLabel = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
`;
