import { Icon, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

export function UIBadge({ text, icon }: { text: string; icon: string }) {
  const theme = useTheme();

  return (
    <StyledView>
      <Icon source={icon} size={20} color={theme.colors.primary} />
      <StyledText>{text}</StyledText>
    </StyledView>
  );
}

const StyledView = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  padding: 4px 10px;
  background-color: ${(props) => props.theme.colors.primaryContainer};
  gap: 6px;
`;

const StyledText = styled.Text`
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
`;
