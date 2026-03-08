import { CheckCircle, ClockAlert, SquareX, Users } from 'lucide-react-native'
import { TouchableOpacity, useColorScheme } from 'react-native'

import { Typography } from '@/components/typography'
import { startCase } from '@/lib/utils'
import { PrayerStatus } from '@/types'

type PrayerActionProps = {
  onPress: (status?: PrayerStatus) => void
  status: PrayerStatus
}

export function PrayerAction({ onPress, status }: PrayerActionProps) {
  const colorScheme = useColorScheme()

  function handleStatusSelection() {
    if (status === 'jamaah') onPress()
    onPress(status)
  }

  function Icon() {
    switch (status) {
      case 'late':
        return <ClockAlert color='#d38b16' />
      case 'jamaah':
        return <Users color='#a2c9ff' />
      case 'missed':
        return <SquareX color='#ce0f12' />
      case 'ontime':
        return <CheckCircle color='#21cb5a' />
    }
  }

  return (
    <TouchableOpacity
      className='p-4 rounded-lg items-center flex flex-row gap-2 my-2 bg-accent dark:bg-accent-dark'
      onPress={handleStatusSelection}
    >
      <Icon />
      <Typography>{startCase(status)}</Typography>
    </TouchableOpacity>
  )
}
