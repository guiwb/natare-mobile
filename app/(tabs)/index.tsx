import { useAuth } from '@/contexts/AuthProvider';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function HomeScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Home tab</Text>
      <Button mode="contained" onPress={logout}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
