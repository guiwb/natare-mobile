import { UITabBar } from '@/components/UI/TabBar';
import { TabBarProvider } from '@/contexts/TabBarProvider';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { View } from 'react-native';

const { Navigator } = createMaterialTopTabNavigator();

const Tabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  return (
    <TabBarProvider>
      <View style={{ flex: 1 }}>
        <Tabs
          tabBarPosition="bottom"
          screenOptions={{ swipeEnabled: true }}
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
