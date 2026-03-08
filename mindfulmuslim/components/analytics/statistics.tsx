import { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'

import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { getPrayers } from '@/firebase/prayers'
import { useAuthStore } from '@/store/auth'

type StatisticsProps = {
  startDay: Dayjs
}

export function Statistics({ startDay }: StatisticsProps) {
  const { user } = useAuthStore()

  const [metPrayer, setMetPrayer] = useState(0)
  const [bestDay, setBestDay] = useState(0)

  useEffect(() => {
    if (!user) return

    const startDate = startDay.toDate()
    const endDate = startDay.add(6, 'day').toDate()

    getPrayers(user.uid, [startDate, endDate]).then((prayers) => {
      const prayersMet = prayers.filter((prayer) => prayer.status !== 'missed').length
      setMetPrayer(prayersMet)

      const dayPerformance = new Map<string, number>()

      prayers.forEach((prayer) => {
        if (prayer.status === 'ontime' || prayer.status === 'jamaah') {
          const prayerDate = new Date(prayer.date).toDateString()
          dayPerformance.set(prayerDate, (dayPerformance.get(prayerDate) || 0) + 1)
        }
      })

      const bestPerformance = Math.max(...[...dayPerformance.values(), 0])

      const daysWithBestPerformance = [...dayPerformance.values()].filter(
        (count) => count === bestPerformance
      ).length

      setBestDay(daysWithBestPerformance)
    })

    return () => {
      setMetPrayer(0)
      setBestDay(0)
    }
  }, [startDay, user])

  return (
    <Box className='flex flex-row items-center justify-center gap-8 py-4'>
      <Box className='flex flex-col items-center'>
        <Typography type='title'>{Math.round((metPrayer / 35) * 100)}%</Typography>
        <Typography>Met</Typography>
      </Box>
      <Box className='flex flex-col items-center'>
        <Typography type='title'>{bestDay}</Typography>
        <Typography>Best Days</Typography>
      </Box>
      <Box className='flex flex-col items-center'>
        <Typography type='title'>{metPrayer}</Typography>
        <Typography>Total Done</Typography>
      </Box>
    </Box>
  )
}
