import { AppBackground } from '@/components/AppBackground';
import { UILoadingIndicator } from '@/components/UI/LoadingIndicator';
import { AuthProvider, useAuth } from '@/contexts/AuthProvider';
import { ConfirmDialogProvider } from '@/contexts/ConfirmDialogProvider';
import { NotificationsProvider } from '@/contexts/NotificationsProvider';
import { SnackbarProvider } from '@/contexts/SnackbarProvider';
import {
  DEFAULT_BRAND_COLOR,
  readableBrandColor,
  withAlpha,
} from '@/lib/brand';
import { DarkTheme, ThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode, useMemo } from 'react';
import { Platform, View } from 'react-native';
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
            animation: Platform.OS === 'android' ? 'fade' : 'default',
            animationDuration: 180,
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

function buildAppTheme(brandColor?: string | null) {
  const primary = brandColor
    ? readableBrandColor(brandColor)
    : DEFAULT_BRAND_COLOR;

  return {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary,
      primaryContainer: withAlpha(primary, 0.2),
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
}

function BrandedTheme({ children }: { children: ReactNode }) {
  const { company } = useAuth();
  const brandColor = company?.brand_color;
  const theme = useMemo(() => buildAppTheme(brandColor), [brandColor]);

  return (
    <StyledProvider theme={theme}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </StyledProvider>
  );
}

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
            <BrandedTheme>
              <NotificationsProvider>
                <ConfirmDialogProvider>
                  <Routes />
                  <StatusBar style="light" />
                </ConfirmDialogProvider>
              </NotificationsProvider>
            </BrandedTheme>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
