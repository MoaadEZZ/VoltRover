import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="vehicles"
        options={{
          title: 'My Vehicles',
          headerStyle: {
            backgroundColor: '#8B5CF6',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="payment-methods"
        options={{
          title: 'Payment Methods',
          headerStyle: {
            backgroundColor: '#8B5CF6',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: '#8B5CF6',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack>
  );
}