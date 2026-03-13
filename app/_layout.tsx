import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack initialRouteName="login">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      </Stack>

      <StatusBar style="auto" />
    </PaperProvider>
  );
}
