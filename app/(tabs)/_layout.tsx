import { Tabs } from 'expo-router';
import { Battery, MapPin, Brain, CreditCard, Clock, CircleUser as UserCircle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#6B7280',
        headerStyle: {
          backgroundColor: '#8B5CF6',
        },
        headerTintColor: '#fff',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'VoltRover',
          tabBarIcon: ({ color, size }) => <Battery size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: 'Track',
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="battery-ai"
        options={{
          title: 'AI Insights',
          tabBarIcon: ({ color, size }) => <Brain size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          title: 'Payment',
          tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <UserCircle size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}