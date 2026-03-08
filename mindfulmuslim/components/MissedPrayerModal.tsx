import { Box } from './box'
import { Typography } from './typography'
import ThemedButton from './ui/button'
import { Bell } from 'lucide-react-native'
import { Colors } from '@/constants/colors'
import { Hadith } from '@/constants/hadith'
import { startCase } from '@/lib/utils'
import { useColorScheme } from 'react-native'

interface MissedPrayerModalProps {
  visible: boolean
  userName?: string | null
  prayerName?: string | null
  hadith?: Hadith
  onDismiss: () => void
}

export const MissedPrayerModal = ({
  visible,
  userName,
  prayerName,
  hadith,
  onDismiss
}: MissedPrayerModalProps) => {
  const colorScheme = useColorScheme()
  if (!visible) return null
  return (
    <Box className='absolute top-0 left-0 right-0 bottom-0 z-10 flex justify-center items-center bg-black/50'>
      <Box type='accent' className='p-5 rounded-xl gap-4 w-4/5 relative'>
        <Box className='flex items-center justify-center flex-row gap-2 mb-7'>
          <Bell color={Colors[colorScheme ?? 'light'].icon} />
          <Typography type='subtitle' className='font-medium text-center dark:text-black'>
            {userName}, you missed {prayerName} today!
          </Typography>
        </Box>
        <Box className='flex flex-col gap-2'>
          <Typography type='subtitle' className='dark:text-black'>
            Pray {startCase(prayerName || '')}
          </Typography>
          <Box className='flex flex-row'>
            <Typography className='dark:text-black'>
              {hadith?.text}
              <Typography className='italic'> ({hadith?.source})</Typography>
            </Typography>
          </Box>
        </Box>
        <Box className='flex flex-col gap-2'>
          <Typography type='subtitle' className='dark:text-black'>
            What you can do?
          </Typography>
          <Box className='flex flex-col gap-2'>
            {hadith?.action.map((action, index) => (
              <Box className='flex flex-row gap-2' key={index}>
                <Typography>{index + 1}.</Typography>
                <Typography>{action}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box className='flex items-center mt-4'>
          <ThemedButton onPress={onDismiss} title='Dismiss' />
        </Box>
      </Box>
    </Box>
  )
}
