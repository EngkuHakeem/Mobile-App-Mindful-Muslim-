import { composeAsync, isAvailableAsync } from 'expo-mail-composer'
import { useNavigation, useRouter } from 'expo-router'
import { HeartHandshake, MessageSquare, Settings } from 'lucide-react-native'
import { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/avatar'
import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import Button from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { Colors } from '@/constants/colors'
import { ScrollView, TouchableOpacity, useColorScheme } from 'react-native'

export default function Profile() {
  const router = useRouter()
  const navigation = useNavigation()
  const { user } = useAuthStore()
  const colorScheme = useColorScheme()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  async function sendEmail() {
    const isAvailable = await isAvailableAsync()
    if (!isAvailable) {
      alert('Email is not available on this device')
      return
    }

    await composeAsync({
      recipients: ['mindfulmuslim@org.my'],
      subject: 'Mindful Muslim Feedback',
      body: ''
    })
  }

  function navigateSettings() {
    router.push('/profile/settings')
  }

  function inviteFriend() {
    router.push('/profile/prayer-buddy')
  }

  return (
    <SafeAreaView
      className='flex-1 bg-background dark:bg-background-dark p-4'
      edges={['top', 'left', 'right']}
    >
      <ScrollView>
        <Box type='card' className='items-center mt-4 gap-20'>
          <Box className='items-center gap-2'>
            <Avatar
              url={user?.photoURL}
              displayName={user?.displayName || user?.email}
              className='size-24 rounded-full'
            />
            <Typography className='mt-2 text-xl font-bold'>
              {user?.displayName ?? user?.email}
            </Typography>
          </Box>
          <Box className='gap-4 flex flex-col items-center'>
            <TouchableOpacity
              onPress={navigateSettings}
              className='flex flex-row items-center gap-4'
            >
              <Settings color={Colors[colorScheme ?? 'light'].icon} />
              <Typography>Settings</Typography>
            </TouchableOpacity>
            <TouchableOpacity onPress={inviteFriend} className='flex flex-row items-center gap-4'>
              <HeartHandshake color={Colors[colorScheme ?? 'light'].icon} />
              <Typography>Invite a Friend</Typography>
            </TouchableOpacity>
            <TouchableOpacity onPress={sendEmail} className='flex flex-row items-center gap-4'>
              <MessageSquare color={Colors[colorScheme ?? 'light'].icon} />
              <Typography>Feedback</Typography>
            </TouchableOpacity>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  )
}
