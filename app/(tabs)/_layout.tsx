import { UITabBar } from '@/components/UI/TabBar';
import { UITopBlur } from '@/components/UI/TopBlur';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <UITabBar {...props} />}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: () => 'home',
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Treinos',
          tabBarIcon: () => 'dumbbell',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: () => 'account',
        }}
      />
      </Tabs>
      <UITopBlur />
    </View>
  );
}
