import styled from 'styled-components/native';

export function DataCard({
  title,
  value,
  unitText,
}: {
  title: string;
  value: string | number;
  unitText: string;
}) {
  return (
    <StyledView>
      <StyledTitle>{title}</StyledTitle>
      <StyledValue>
        {value} <StyledValueLabel>{unitText}</StyledValueLabel>
      </StyledValue>
    </StyledView>
  );
}

const StyledView = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.outline};
  border-radius: 12px;
  padding: 12px;
  flex: 1;
  padding: 12px;
`;

const StyledTitle = styled.Text`
  color: ${(props) => props.theme.colors.onSurfaceVariant};
  font-size: 14px;
`;

const StyledValue = styled.Text`
  color: ${(props) => props.theme.colors.onSurface};
  font-size: 18px;
  font-weight: bold;
`;

const StyledValueLabel = styled.Text`
  color: ${(props) => props.theme.colors.onSurfaceVariant};
  font-size: 12px;
`;
