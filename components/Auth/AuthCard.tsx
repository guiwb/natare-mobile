import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import styled from 'styled-components/native';

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <StyledBlur
      intensity={24}
      tint="dark"
      experimentalBlurMethod="dimezisBlurView"
    >
      <StyledInner>{children}</StyledInner>
    </StyledBlur>
  );
}

const StyledBlur = styled(BlurView)`
  width: 100%;
  max-width: 460px;
  border-radius: 24px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outline};
`;

const StyledInner = styled.View`
  padding: 28px 22px;
  gap: 14px;
`;
