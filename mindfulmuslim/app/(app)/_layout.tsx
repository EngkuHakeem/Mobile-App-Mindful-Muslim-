import { Redirect, Tabs } from 'expo-router'
import { ChartNoAxesColumn, Home, User } from 'lucide-react-native'

import { useAuthStore } from '@/store/auth'

export default function AppLayout() {
  const { user } = useAuthStore()

  if (!user) return <Redirect href='/login' />

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#166534',
        tabBarStyle: {
          backgroundColor: '#18191b'
        }
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={28} />
        }}
      />
      <Tabs.Screen
        name='analytics'
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <ChartNoAxesColumn size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={28} color={color} />
        }}
      />
    </Tabs>
  )
}
