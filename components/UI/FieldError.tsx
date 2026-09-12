import styled from 'styled-components/native';

export function UIFieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <Message>{message}</Message>;
}

const Message = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
`;
