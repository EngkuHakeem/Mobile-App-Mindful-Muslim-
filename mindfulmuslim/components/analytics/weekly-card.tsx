import dayjs, { Dayjs } from 'dayjs'
import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'

import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { getPrayers } from '@/firebase/prayers'
import { cn, getStatusColor, startCase } from '@/lib/utils'
import { PRAYER_TIMES, PrayerType } from '@/types'
import { PrayerModel } from '@/types/prayer'

type WeeklyCardProps = {
  user: Partial<User> | null
  startDay: Dayjs
  size: 'default' | 'small'
  showPrayerCount?: boolean
}

export function WeeklyCard({ user, startDay, size, showPrayerCount }: WeeklyCardProps) {
  const weekDates = Array.from({ length: 7 }, (_, i) => dayjs(startDay).add(i, 'day'))

  const colorScheme = useColorScheme()

  const [prayerData, setPrayerData] = useState<PrayerModel[]>([])
  const [prayerCount, setPrayerCount] = useState(0)

  useEffect(() => {
    if (!user) return

    const startDate = startDay.toDate()
    const endDate = startDay.add(6, 'day').toDate()

    getPrayers(user?.uid ?? '', [startDate, endDate]).then((prayers) => {
      setPrayerData(prayers)
      const count = prayers.filter((p) => p.status && p.status !== 'missed').length
      setPrayerCount(count)
    })

    return () => {
      setPrayerData([])
      setPrayerCount(0)
    }
  }, [startDay])

  function getPrayerData(date: dayjs.Dayjs, prayerType: PrayerType) {
    const dateStartOfDay = date.startOf('day')
    const dateTimestamp = dateStartOfDay.valueOf()

    const prayer = prayerData.find((item) => {
      const prayerDateObj = dayjs(item.date)
      const prayerDate = prayerDateObj.startOf('day').valueOf()
      const match = prayerDate === dateTimestamp && item.type === prayerType
      return match
    })

    return prayer
  }

  return (
    <Box className={cn('w-full', { 'gap-4': size === 'default', 'gap-2': size === 'small' })}>
      <Typography className='self-center'>{prayerCount} prayer completed</Typography>
      {[...Array(6)].map((_, rowIndex) => (
        <Box key={`row-${rowIndex}`} className='flex items-center justify-center flex-row gap-2'>
          {rowIndex === 0
            ? ['', 'S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, colIndex) => (
                <Box
                  key={`header-${colIndex}`}
                  className={cn('rounded flex flex-row justify-center items-center', {
                    'h-[30px]': size === 'default',
                    'w-[30px]': size === 'default' && colIndex !== 0,
                    'w-20': size === 'default' && colIndex === 0,
                    'size-5': size === 'small',
                    'size-4': size === 'small' && colIndex !== 0,
                    'bg-background dark:bg-background-dark': colIndex !== 0
                  })}
                >
                  <Typography
                    className={cn({
                      'text-xs': size === 'small',
                      'text-sm': size === 'default'
                    })}
                  >
                    {day}
                  </Typography>
                </Box>
              ))
            : [...Array(8)].map((_, colIndex) => {
                if (colIndex === 0) {
                  const prayer = startCase(PRAYER_TIMES[rowIndex - 1])

                  return (
                    <Box
                      key={`cell-${rowIndex}-${colIndex}`}
                      className={cn(
                        'rounded justify-center items-center bg-background dark:bg-background-dark',
                        {
                          'w-[80px]': size === 'default',
                          'h-[30px]': size === 'default',
                          'size-5': size === 'small'
                        }
                      )}
                    >
                      <Typography
                        className={cn({
                          'text-xs uppercase': size === 'small',
                          'text-sm': size === 'default'
                        })}
                      >
                        {size === 'default' ? prayer : prayer.charAt(0)}
                      </Typography>
                    </Box>
                  )
                }

                const dayIndex = colIndex - 1
                const prayerIndex = rowIndex - 1
                const date = weekDates[dayIndex]
                const prayerType = PRAYER_TIMES[prayerIndex]
                const prayer = getPrayerData(date, prayerType)
                const backgroundColor = getStatusColor(prayer?.status, colorScheme)

                return (
                  <Box
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={cn('rounded justify-center items-center', {
                      'size-[30px]': size === 'default',
                      'size-4': size === 'small'
                    })}
                  >
                    <Box className='size-5 rounded' style={{ backgroundColor }} />
                  </Box>
                )
              })}
        </Box>
      ))}
    </Box>
  )
}
