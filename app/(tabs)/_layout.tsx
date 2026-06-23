import { UITabBar } from '@/components/UI/TabBar';
import { TabBarProvider } from '@/contexts/TabBarProvider';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <TabBarProvider>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <UITabBar {...props} />}
        >
          <Tabs.Screen name="index" options={{ title: 'Início' }} />
          <Tabs.Screen name="workouts" options={{ title: 'Treinos' }} />
          <Tabs.Screen
            name="notifications"
            options={{ title: 'Notificações' }}
          />
          <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
        </Tabs>
      </View>
    </TabBarProvider>
  );
}
