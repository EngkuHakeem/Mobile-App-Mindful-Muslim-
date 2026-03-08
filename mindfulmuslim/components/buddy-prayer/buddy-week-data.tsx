import dayjs from 'dayjs'
import { User } from 'firebase/auth'

import { WeeklyCard } from '@/components/analytics/weekly-card'
import { Box } from '@/components/box'

type BuddyWeekDataProps = {
  user: Partial<User> | null
}

export function BuddyWeekData({ user }: BuddyWeekDataProps) {
  return (
    <Box className='flex flex-col items-center justify-center gap-4'>
      <WeeklyCard startDay={dayjs().startOf('week')} user={user} size='small' />
    </Box>
  )
}
