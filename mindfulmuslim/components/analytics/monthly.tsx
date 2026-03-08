import dayjs, { type Dayjs } from 'dayjs'
import { Calendar, ChevronLeft, ChevronRight, Info, Moon, Star, Users } from 'lucide-react-native'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native'

import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import ThemedButton from '@/components/ui/button'
import { Colors, statusColors } from '@/constants/colors'
import { getPrayers } from '@/firebase/prayers'
import { cn, startCase } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { PRAYER_TIMES } from '@/types'
import type { PrayerModel } from '@/types/prayer'

export function Monthly() {
  const colorScheme = useColorScheme()
  const screenHeight = Dimensions.get('window').height
  const { user } = useAuthStore()

  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [openExplanation, setOpenExplanation] = useState(false)
  const [prayerMap, setPrayerMap] = useState<Record<string, Record<string, PrayerModel>>>({})
  const [showLoading, setShowLoading] = useState(false)

  const drawerAnimation = useRef(new Animated.Value(screenHeight)).current

  useEffect(() => {
    if (!user) return

    const startDate = currentMonth.startOf('month').toDate()
    const endDate = currentMonth.endOf('month').toDate()

    getPrayers(user.uid, [startDate, endDate])
      .then((data) => {
        const map: Record<string, Record<string, PrayerModel>> = {}

        data.forEach((prayer) => {
          const day = dayjs(prayer.date).date() as number
          if (!map[day]) {
            map[day] = {}
          }
          map[day][prayer.type] = prayer
        })

        setPrayerMap(map)
      })
      .catch((error) => {
        console.error('Error fetching prayers:', error)
      })

    return () => {
      setPrayerMap({})
    }
  }, [currentMonth])

  function goToPrevMonth() {
    setCurrentMonth((prev) => prev.subtract(1, 'month'))
  }

  function goToNextMonth() {
    setCurrentMonth((prev) => prev.add(1, 'month'))
  }

  const isNextMonthInFuture =
    currentMonth.month() >= dayjs().month() && currentMonth.year() >= dayjs().year()

  const monthText = currentMonth.format('MMMM YYYY')
  const daysInMonth = currentMonth.daysInMonth()
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const daysRows: number[][] = []

  for (let i = 0; i < daysArray.length; i += 7) {
    daysRows.push(daysArray.slice(i, i + 7))
  }

  const calculatePrayerPercentage = useCallback(
    (prayerType: string) => {
      const totalDays = daysInMonth
      let completedCount = 0

      Object.values(prayerMap).forEach((dayData) => {
        if (dayData[prayerType] && dayData[prayerType].status !== 'missed') {
          completedCount++
        }
      })

      return Math.round((completedCount / totalDays) * 100) || 0
    },
    [prayerMap, daysInMonth]
  )

  const countJamaahPrayers = useCallback(
    (prayerType: string) => {
      let jamaahCount = 0

      Object.values(prayerMap).forEach((dayData) => {
        if (dayData[prayerType] && dayData[prayerType].status === 'jamaah') {
          jamaahCount++
        }
      })

      return jamaahCount
    },
    [prayerMap]
  )

  const isCurrentDay = useCallback(
    (day: number) => {
      const today = dayjs()
      return (
        today.date() === day &&
        today.month() === currentMonth.month() &&
        today.year() === currentMonth.year()
      )
    },
    [currentMonth]
  )

  const isPastDay = useCallback(
    (day: number) => {
      const today = dayjs()
      const checkDate = currentMonth.date(day) as Dayjs
      return checkDate.isBefore(today, 'day')
    },
    [currentMonth]
  )

  const isFutureDay = useCallback(
    (day: number) => {
      const today = dayjs()
      const checkDate = currentMonth.date(day) as Dayjs
      return checkDate.isAfter(today, 'day')
    },
    [currentMonth]
  )

  const getCellBackgroundColor = useCallback(
    (day: number, prayerType: string) => {
      if (prayerMap[day] && prayerMap[day][prayerType]) {
        const prayer = prayerMap[day][prayerType]
        return statusColors[prayer.status as keyof typeof statusColors].color || 'transparent'
      }

      if (isPastDay(day)) return statusColors.missing.color
      else if (isFutureDay(day)) return statusColors.upcoming.color
      else return 'transparent'
    },
    [prayerMap, isPastDay, isFutureDay]
  )

  function openExplanationDrawer() {
    setOpenExplanation(true)
    Animated.timing(drawerAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start()
  }

  function closeExplanationDrawer() {
    Animated.timing(drawerAnimation, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setOpenExplanation(false)
    })
  }

  const calculateOverallPercentage = useCallback(() => {
    const totalPossiblePrayers = daysInMonth * PRAYER_TIMES.length
    let completedCount = 0

    Object.values(prayerMap).forEach((dayData) => {
      Object.values(dayData).forEach((prayer) => {
        if (prayer.status !== 'missed') {
          completedCount++
        }
      })
    })

    return Math.round((completedCount / totalPossiblePrayers) * 100) || 0
  }, [prayerMap, daysInMonth])

  const countTotalJamaahPrayers = useCallback(() => {
    let jamaahCount = 0

    Object.values(prayerMap).forEach((dayData) => {
      Object.values(dayData).forEach((prayer) => {
        if (prayer.status === 'jamaah') {
          jamaahCount++
        }
      })
    })

    return jamaahCount
  }, [prayerMap])

  const countUniqueMosques = useCallback(() => {
    const mosqueIds = new Set()

    Object.values(prayerMap).forEach((dayData) => {
      Object.values(dayData).forEach((prayer) => {
        if (prayer.mosqueId) {
          mosqueIds.add(prayer.mosqueId)
        }
      })
    })

    return mosqueIds.size
  }, [prayerMap])

  const determineBestPrayer = useCallback(() => {
    const prayerScores: Record<
      string,
      { jamaah: number; ontime: number; late: number; missed: number }
    > = {}

    PRAYER_TIMES.forEach((prayer) => {
      prayerScores[prayer] = { jamaah: 0, ontime: 0, late: 0, missed: 0 }
    })

    Object.values(prayerMap).forEach((dayData) => {
      Object.entries(dayData).forEach(([type, prayer]) => {
        if (prayerScores[type]) {
          prayerScores[type][prayer.status as keyof (typeof prayerScores)[typeof type]]++
        }
      })
    })

    const sortedPrayers = [...PRAYER_TIMES].sort((a, b) => {
      if (prayerScores[a].jamaah !== prayerScores[b].jamaah) {
        return prayerScores[b].jamaah - prayerScores[a].jamaah
      }

      if (prayerScores[a].ontime !== prayerScores[b].ontime) {
        return prayerScores[b].ontime - prayerScores[a].ontime
      }

      if (prayerScores[a].late !== prayerScores[b].late) {
        return prayerScores[b].late - prayerScores[a].late
      }

      return prayerScores[a].missed - prayerScores[b].missed
    })

    return sortedPrayers[0] ? startCase(sortedPrayers[0]) : 'None'
  }, [prayerMap])

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent
    if (contentOffset.y < -30) {
      setShowLoading(true)
    }
  }

  const handleScrollEnd = () => {
    setShowLoading(false)
  }

  return (
    <Box type='background' className='flex-1 p-4 gap-4'>
      <Box type='accent' className='p-4 rounded-lg gap-4 items-center'>
        <Box className='flex-row items-center gap-4'>
          <Typography type='title'>SALAH TRACKER</Typography>
          <TouchableOpacity onPress={openExplanationDrawer}>
            <Info color={Colors[colorScheme ?? 'light'].icon} />
          </TouchableOpacity>
        </Box>

        <Box className='flex-row gap-4 items-center'>
          <TouchableOpacity className='rounded-full p-1 bg-white' onPress={goToPrevMonth}>
            <ChevronLeft />
          </TouchableOpacity>
          <Typography className='py-1 px-2 rounded-lg bg-background dark:bg-background-dark'>
            {monthText}
          </Typography>
          <TouchableOpacity
            className={cn('bg-white rounded-full p-1 opacity-100', {
              'opacity-50': isNextMonthInFuture
            })}
            onPress={goToNextMonth}
            disabled={isNextMonthInFuture}
          >
            <ChevronRight />
          </TouchableOpacity>
        </Box>
      </Box>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {showLoading && (
          <Box className='w-full items-center py-2'>
            <ActivityIndicator size='small' />
          </Box>
        )}
        <Box className='flex-1 flex-row flex-wrap justify-between gap-4'>
          {PRAYER_TIMES.map((prayer) => (
            <Box type='accent' key={prayer} className='rounded-lg p-2 items-center w-[48%] h-[31%]'>
              <Typography className='text-center rounded-lg mb-1 w-full p-[1px] bg-background dark:bg-background-dark'>
                {startCase(prayer)}
              </Typography>

              <Box className='w-full h-3/4'>
                <Box className='flex-row justify-between mb-1 px-2'>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <Typography
                      key={`header-${index}`}
                      className='text-center w-4 text-[8px] text-black dark:text-white'
                    >
                      {day}
                    </Typography>
                  ))}
                </Box>
                <Box className='flex-col rounded overflow-hidden border-[0.5px] border-black'>
                  {daysRows.map((row, rowIndex) => (
                    <Box
                      key={`${prayer}-row-${rowIndex}`}
                      className={cn('flex-row w-full border-t-black h-[20px] border-t-0', {
                        'border-t-[0.5px]': rowIndex > 0
                      })}
                    >
                      {row.map((day, colIndex) => (
                        <Box
                          key={`${prayer}-day-${day}`}
                          className={cn(
                            'flex-1 justify-center items-center border-l-black border-b-black',
                            {
                              'border-l-[0.5px]': colIndex > 0,
                              'border-b-[0.5px]': rowIndex < daysRows.length - 1
                            }
                          )}
                          style={{ backgroundColor: getCellBackgroundColor(day, prayer) }}
                        >
                          <Typography
                            className='text-sm'
                            style={{
                              color:
                                getCellBackgroundColor(day, prayer) === '#E0E0E0'
                                  ? 'black'
                                  : 'white',
                              ...(isCurrentDay(day) && {
                                borderWidth: 1,
                                borderColor: 'red',
                                borderRadius: 10,
                                paddingHorizontal: 3,
                                paddingVertical: 0
                              })
                            }}
                          >
                            {day}
                          </Typography>
                        </Box>
                      ))}

                      {Array.from({ length: 7 - row.length }, (_, i) => (
                        <Box
                          key={`${prayer}-empty-${i}`}
                          className={cn('flex-1 border-l-black border-b-black bg-slate-500/10', {
                            'border-l-[0.5px]': i > 0,
                            'border-b-[0.5px]': rowIndex < daysRows.length - 1
                          })}
                        />
                      ))}
                    </Box>
                  ))}
                </Box>
                <Box className='flex flex-row justify-between mt-2'>
                  <Box className='flex flex-row items-baseline gap-1'>
                    <Typography type='subtitle'>{calculatePrayerPercentage(prayer)}</Typography>
                    <Typography className='text-[8px]'>%</Typography>
                  </Box>
                  <Box className='flex flex-row items-baseline gap-1'>
                    <Typography type='subtitle'>{countJamaahPrayers(prayer)}</Typography>
                    <Typography className='text-[8px]'>Jamaah</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}

          <Box type='accent' className='rounded-lg p-2 w-[48%]'>
            <Typography
              type='subtitle'
              className='text-center py-1 rounded-lg mb-4 bg-background dark:bg-background-dark'
            >
              Overall Stats
            </Typography>

            <Box className='flex-1 justify-between'>
              <Box className='gap-1'>
                <Box className='flex-row justify-between items-center'>
                  <Box className='flex flex-row items-center gap-1'>
                    <Calendar size={12} color={Colors[colorScheme ?? 'light'].icon} />
                    <Typography className='text-xs dark:text-white'>Month Total</Typography>
                  </Box>
                  <Typography className='text-sm dark:text-white'>
                    {calculateOverallPercentage()}%
                  </Typography>
                </Box>

                <Box className='flex-row justify-between items-center'>
                  <Box className='flex flex-row items-center gap-1'>
                    <Users size={12} color={Colors[colorScheme ?? 'light'].icon} />
                    <Typography className='text-xs dark:text-white'>Total Jamaah</Typography>
                  </Box>
                  <Typography className='text-sm dark:text-white'>
                    {countTotalJamaahPrayers()}
                  </Typography>
                </Box>

                <Box className='flex-row justify-between items-center'>
                  <Box className='flex flex-row items-center gap-1'>
                    <Moon size={12} color={Colors[colorScheme ?? 'light'].icon} />
                    <Typography className='text-xs dark:text-white'>Masjid Prayed</Typography>
                  </Box>
                  <Typography className='text-sm dark:text-white'>
                    {countUniqueMosques()}
                  </Typography>
                </Box>
                <Box className='flex-row justify-between items-center'>
                  <Box className='flex flex-row items-center gap-1'>
                    <Star size={12} color={Colors[colorScheme ?? 'light'].icon} />
                    <Typography className='text-xs dark:text-white'>Best Prayer</Typography>
                  </Box>
                  <Typography className='text-sm dark:text-white'>
                    {determineBestPrayer()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </ScrollView>
      <Modal
        transparent={true}
        visible={openExplanation}
        animationType='none'
        onRequestClose={closeExplanationDrawer}
      >
        <TouchableWithoutFeedback onPress={closeExplanationDrawer}>
          <Box className='flex-1 bg-black/50'>
            <TouchableWithoutFeedback>
              <Animated.View
                className='absolute bottom-0 left-0 right-0 rounded-tl-2xl rounded-tr-2xl p-8 bg-background dark:bg-background-dark'
                style={{ transform: [{ translateY: drawerAnimation }] }}
              >
                <Box className='flex-row items-center gap-4 mb-4'>
                  <Info color={Colors[colorScheme ?? 'light'].icon} />
                  <Typography className='font-semibold text-xl'>Monthly Prayer Analysis</Typography>
                </Box>

                <Box className='gap-4'>
                  <Box className='flex-row items-start gap-4'>
                    <Box className='font-bold'>
                      <Typography>1. Percentage:</Typography>
                      <Typography className='pl-4'>
                        • Displays the percentage of each particular prayer completed for the month
                      </Typography>
                      <Typography className='pl-4'>
                        • (Total Prayers Completed / 31) × 100
                      </Typography>
                    </Box>
                  </Box>

                  <Box className='flex-row items-start gap-4'>
                    <Box className='flex-1'>
                      <Typography className='font-bold'>2. Jamaah Count:</Typography>
                      <Typography className='pl-4'>
                        • Displays the total number of prayers performed in jamaah for that
                        particular prayer each month
                      </Typography>
                    </Box>
                  </Box>

                  <Box className='flex-row items-start gap-4'>
                    <Box className='flex-1'>
                      <Typography className='font-bold'>4. Color Indicators:</Typography>
                      {Object.entries(statusColors).map(([status, { color, explanation }]) => (
                        <Box key={status} className='pl-4 flex-row gap-4 items-center'>
                          <Box className='size-5 rounded' style={{ backgroundColor: color }} />
                          <Typography>{explanation}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Box className='justify-center items-center mt-4'>
                  <ThemedButton onPress={closeExplanationDrawer} title='Dismiss' />
                </Box>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Box>
        </TouchableWithoutFeedback>
      </Modal>
    </Box>
  )
}
