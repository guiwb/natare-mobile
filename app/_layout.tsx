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

function Routes() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="forgot-password" />
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
    background: '#121212',
    surface: '#1E1E1E',
    text: {
      primary: '#FFFFFF',
      secondary: '#A0A0A0',
    },
    feedback: {
      success: '#4ADE80',
      danger: '#EF4444',
      streak: '#F97316',
    },
    border: 'rgba(255, 255, 255, 0.05)',
    intensity: {
      lvl1: 'rgba(66, 133, 244, 0.2)',
      lvl2: 'rgba(66, 133, 244, 0.4)',
      lvl3: 'rgba(66, 133, 244, 0.6)',
      lvl4: 'rgba(66, 133, 244, 0.8)',
      lvl5: 'rgba(66, 133, 244, 1)',
    },
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
          <PaperProvider theme={paperTheme}>
            <ConfirmDialogProvider>
              <Routes />
              <StatusBar style="auto" />
            </ConfirmDialogProvider>
          </PaperProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
