import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function LoadingIndicator() {
  return (
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
  );
}
