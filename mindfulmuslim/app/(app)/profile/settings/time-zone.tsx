import { useRouter } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import { useEffect } from 'react'
import { TouchableOpacity, useColorScheme } from 'react-native'

import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { useTimeZoneStore } from '@/store/time-zone'
import { Colors } from '@/constants/colors'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TimeZoneScreen() {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const { selectedZone, loading, loadTimeZone } = useTimeZoneStore()

  useEffect(() => {
    loadTimeZone()
  }, [])

  function navigateTimeZoneSelector() {
    router.push('/profile/settings/time-zone-select')
  }

  return (
    <SafeAreaView
      className='flex-1 bg-background dark:bg-background-dark'
      edges={['left', 'right']}
    >
      <Box type='background' className='p-4 gap-4 flex-1'>
        <Typography type='label'>Time Zone</Typography>
        <Box type='card' className='p-4'>
          <TouchableOpacity
            className='flex-row items-center justify-between w-full'
            onPress={navigateTimeZoneSelector}
          >
            <Typography className='text-base w-4/5'>
              {loading ? 'Loading...' : selectedZone?.daerah ?? 'Select a time zone'}
            </Typography>
            <ChevronRight color={Colors[colorScheme ?? 'light'].icon} />
          </TouchableOpacity>
        </Box>
      </Box>
    </SafeAreaView>
  )
}
