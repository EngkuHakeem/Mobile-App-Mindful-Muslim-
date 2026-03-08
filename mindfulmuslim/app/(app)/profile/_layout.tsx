import { InviteButton } from '@/components/buddy-prayer/invite-button'
import { AddButton } from '@/components/masjid/add-masjid-button'
import { Stack } from 'expo-router'

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#166534'
        }
      }}
    >
      <Stack.Screen name='index' options={{ title: 'Profile' }} />
      <Stack.Screen name='settings/index' options={{ title: 'Settings' }} />
      <Stack.Screen name='settings/edit' options={{ title: 'Edit Profile' }} />
      <Stack.Screen name='settings/time-zone' options={{ title: 'Time Zone' }} />
      <Stack.Screen
        name='settings/masjid'
        options={{ title: 'Masjid', headerRight: () => <AddButton /> }}
      />
      <Stack.Screen name='settings/add-masjid' options={{ title: 'Add New Masjid' }} />
      <Stack.Screen
        name='settings/masjid/modal/[id]'
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen name='settings/time-zone-select' options={{ title: 'Select Time Zone' }} />
      <Stack.Screen
        name='prayer-buddy/index'
        options={{ title: 'Prayer Buddy', headerRight: () => <InviteButton /> }}
      />
      <Stack.Screen name='prayer-buddy/link' options={{ title: 'Invitation Link' }} />
      <Stack.Screen name='prayer-buddy/request/index' options={{ title: 'Buddy Request' }} />
      <Stack.Screen
        name='prayer-buddy/request/modal/[uid]'
        options={{ presentation: 'modal', headerShown: false }}
      />
    </Stack>
  )
}
