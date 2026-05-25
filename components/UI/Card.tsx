import styled from 'styled-components/native';

export function UICard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  return <StyledCard style={style}>{children}</StyledCard>;
}

const StyledCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.outline};
  border-radius: 16px;
  padding: 20px;
`;
