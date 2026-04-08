import { AuthProvider, useAuth } from '@/contexts/AuthProvider';
import { ConfirmDialogProvider } from '@/contexts/ConfirmDialogProvider';
import { SnackbarProvider } from '@/contexts/SnackbarProvider';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import {
  ActivityIndicator,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';

function Routes() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = ['login', 'signup'].includes(segments[0]);

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments, router]);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
      {isLoading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
            },
          ]}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
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
