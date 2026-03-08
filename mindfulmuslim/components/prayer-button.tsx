import {
  CheckCircle,
  ClockAlert,
  CloudMoon,
  CloudSun,
  LucideProps,
  Moon,
  SquareX,
  Sun,
  Sunset,
  Users
} from 'lucide-react-native'
import { TouchableOpacity, useColorScheme } from 'react-native'

import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { Colors } from '@/constants/colors'
import { PrayerStatus, PrayerType } from '@/types'

type PrayerButtonProps = {
  title: string
  prayerType: PrayerType
  onPress: (prayerType: PrayerType) => void
  extraInfo?: string
  status?: PrayerStatus
}

export function PrayerButton({ title, prayerType, onPress, extraInfo, status }: PrayerButtonProps) {
  const colorScheme = useColorScheme()

  const Icon = ({ color }: LucideProps) => {
    switch (prayerType) {
      case 'fajr':
        return <CloudMoon color={color} />
      case 'dhuhr':
        return <Sun color={color} />
      case 'asr':
        return <CloudSun color={color} />
      case 'maghrib':
        return <Sunset color={color} />
      case 'isha':
        return <Moon color={color} />
    }
  }

  function Status() {
    switch (status) {
      case 'ontime':
        return <CheckCircle color='#21cb5a' />
      case 'jamaah':
        return <Users color='#a2c9ff' />
      case 'missed':
        return <SquareX color='#ce0f12' />
      case 'late':
        return <ClockAlert color='#d38b16' />
      default:
        return null
    }
  }

  return (
    <TouchableOpacity
      onPress={() => onPress(prayerType)}
      className='flex flex-row justify-between p-4 rounded-lg bg-accent dark:bg-accent-dark'
    >
      <Box className='flex flex-row items-center gap-2'>
        <Icon color={Colors[colorScheme ?? 'light'].icon} />
        <Typography>{title}</Typography>
      </Box>

      <Status />
      {extraInfo && <Typography className='text-xs'>{extraInfo}</Typography>}
    </TouchableOpacity>
  )
}
