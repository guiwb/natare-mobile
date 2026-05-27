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
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ThemeProvider as StyledProvider } from 'styled-components/native';

function Routes() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
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
      background: paperTheme.colors.background,
    },
  };

  return (
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
  );
}
