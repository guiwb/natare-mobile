import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export function AuthScreen({ children }: { children: ReactNode }) {
  return (
    <StyledAvoiding behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StyledSafeArea edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </StyledSafeArea>
    </StyledAvoiding>
  );
}

const StyledAvoiding = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const StyledSafeArea = styled(SafeAreaView)`
  flex: 1;
`;
