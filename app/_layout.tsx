import { AppBackground } from '@/components/AppBackground';
import { UILoadingIndicator } from '@/components/UI/LoadingIndicator';
import { AuthProvider, useAuth } from '@/contexts/AuthProvider';
import { ConfirmDialogProvider } from '@/contexts/ConfirmDialogProvider';
import { NotificationsProvider } from '@/contexts/NotificationsProvider';
import { SnackbarProvider } from '@/contexts/SnackbarProvider';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { ThemeProvider as StyledProvider } from 'styled-components/native';

function Routes() {
  const { user, isLoading } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <AppBackground />
      {isLoading ? (
        <UILoadingIndicator />
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Protected guard={!user}>
            <Stack.Screen name="login" />
            <Stack.Screen name="forgot-password" />
          </Stack.Protected>
          <Stack.Protected guard={!!user}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="change-password" />
            <Stack.Screen name="delete-account" />
            <Stack.Screen name="workout/[id]" />
            <Stack.Screen name="workout/share/[id]" />
          </Stack.Protected>
        </Stack>
      )}
    </View>
  );
}

const appTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4285F4',
    primaryContainer: 'rgba(66, 133, 244, 0.2)',
    background: '#121212',
    surface: '#1E1E1E',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#A0A0A0',
    onBackground: '#FFFFFF',
    error: '#EF4444',
    errorContainer: 'rgba(239, 68, 68, 0.2)',
    outline: 'rgba(255, 255, 255, 0.05)',
    outlineVariant: 'rgba(255, 255, 255, 0.05)',
  },
};

export default function RootLayout() {
  const navTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: 'transparent',
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navTheme}>
        <SnackbarProvider>
          <AuthProvider>
            <StyledProvider theme={appTheme}>
              <PaperProvider theme={appTheme}>
                <NotificationsProvider>
                  <ConfirmDialogProvider>
                    <Routes />
                    <StatusBar style="light" />
                  </ConfirmDialogProvider>
                </NotificationsProvider>
              </PaperProvider>
            </StyledProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
