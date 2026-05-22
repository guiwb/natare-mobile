import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function WorkoutsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium">Treinos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
});
