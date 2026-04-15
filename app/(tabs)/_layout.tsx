import { Tabs } from 'expo-router';
import { Icon, useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon(props) {
            return (
              <Icon
                color={
                  props.focused
                    ? theme.colors.primary
                    : theme.colors.onSurfaceDisabled
                }
                size={20}
                source="account"
              />
            );
          },
        }}
      />
    </Tabs>
  );
}
