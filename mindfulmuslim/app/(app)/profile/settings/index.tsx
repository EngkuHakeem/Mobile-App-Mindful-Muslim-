import { useRouter } from 'expo-router'
import {
  Bell,
  CircleHelp,
  Flag,
  Globe,
  Info,
  Lock,
  LogOut,
  MapPin,
  Moon,
  UserPen,
  UserPlus
} from 'lucide-react-native'
import { ScrollView, TouchableOpacity, useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { Colors } from '@/constants/colors'
import { useAuthStore } from '@/store/auth'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Settings() {
  const colorScheme = useColorScheme()
  const { logout } = useAuthStore()
  const router = useRouter()

  function navigateEditProfile() {
    router.push('/profile/settings/edit')
  }

  function navigateTimeZone() {
    router.push('/profile/settings/time-zone')
  }

  function navigateMasjid() {
    router.push('/profile/settings/masjid')
  }

  return (
    <SafeAreaView
      className='flex-1 bg-background dark:bg-background-dark'
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'dark'}
        backgroundColor='transparent'
        translucent={false}
      />
      <Box type='background' className='flex-1'>
        <ScrollView className='flex-1'>
          <Box type='background' className='flex-1 p-8 gap-4'>
            <Box className='gap-4'>
              {/* <Typography type='label'>Account</Typography> */}
              {/* <Box type='card' className='p-4 rounded-lg gap-4'>
                <TouchableOpacity
                  className='flex items-center flex-row gap-4'
                  onPress={navigateEditProfile}
                >
                  <UserPen color={Colors[colorScheme ?? 'light'].icon} />
                  <Typography>Edit Profile</Typography>
                </TouchableOpacity> */}
              {/* <Box className='flex items-center flex-row gap-4'>
            <Bell color={Colors[colorScheme ?? 'light'].icon} />
            <Typography>Notifications</Typography>
            </Box> */}
              {/* </Box> */}
              <Typography type='label'>Settings</Typography>
              <Box type='card' className='p-4 rounded-lg gap-4'>
                <TouchableOpacity
                  className='flex items-center flex-row gap-4'
                  onPress={navigateTimeZone}
                >
                  <Globe color={Colors[colorScheme ?? 'light'].icon} />
                  <Typography>Time Zone</Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  className='flex items-center flex-row gap-4'
                  onPress={navigateMasjid}
                >
                  <Moon color={Colors[colorScheme ?? 'light'].icon} />
                  <Typography>Masjid</Typography>
                </TouchableOpacity>
                {/* <Box className='flex items-center flex-row gap-4'>
            <Lock color={Colors[colorScheme ?? 'light'].icon} />
            <Typography>Privacy</Typography>
            </Box> */}
              </Box>
            </Box>
            <Box className='gap-4'>
              <Typography type='label'>Support & About</Typography>
              <Box type='card' className='p-4 rounded-lg gap-4'>
                {/* <Box className='flex items-center flex-row gap-4'>
            <CircleHelp color={Colors[colorScheme ?? 'light'].icon} />
            <Typography>Help & Support</Typography>
            </Box> */}
                {/* <Box className='flex items-center flex-row gap-4'>
            <Info color={Colors[colorScheme ?? 'light'].icon} />
            <Typography>Terms & Policies</Typography>
            </Box> */}
                {/* <Box className='flex items-center flex-row gap-4'>
            <Flag color={Colors[colorScheme ?? 'light'].icon} />
            <Typography>Report a Problem</Typography>
            </Box> */}
                <TouchableOpacity className='flex items-center flex-row gap-4' onPress={logout}>
                  <LogOut color='#ef4444' />
                  <Typography className='!text-red-500'>Log Out</Typography>
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  )
}
