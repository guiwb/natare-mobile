import { AppBackground } from '@/components/AppBackground';
import { AuthProvider } from '@/contexts/AuthProvider';
import { ConfirmDialogProvider } from '@/contexts/ConfirmDialogProvider';
import { SnackbarProvider } from '@/contexts/SnackbarProvider';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ThemeProvider as StyledProvider } from 'styled-components/native';

function Routes() {
  return (
    <View style={{ flex: 1 }}>
      <AppBackground />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="change-password" />
      </Stack>
    </View>
  );
}

const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4285F4',
    background: '#FAFAFA',
  },
};

const customDarkTheme = {
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
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === 'dark' ? customDarkTheme : customLightTheme;
  const baseNavTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  const navTheme = {
    ...baseNavTheme,
    colors: {
      ...baseNavTheme.colors,
      background: 'transparent',
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navTheme}>
        <SnackbarProvider>
          <AuthProvider>
            <StyledProvider theme={paperTheme}>
              <PaperProvider theme={paperTheme}>
                <ConfirmDialogProvider>
                  <Routes />
                  <StatusBar style="auto" />
                </ConfirmDialogProvider>
              </PaperProvider>
            </StyledProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
