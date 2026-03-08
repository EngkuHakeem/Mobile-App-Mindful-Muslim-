import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react-native'
import { useCallback, useRef, useState } from 'react'
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

import { Statistics } from '@/components/analytics/statistics'
import { WeeklyCard } from '@/components/analytics/weekly-card'
import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import ThemedButton from '@/components/ui/button'
import { Colors } from '@/constants/colors'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'

export function Weekly() {
  const { user } = useAuthStore()
  const colorScheme = useColorScheme()
  const screenHeight = Dimensions.get('window').height

  const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf('week'))
  const [openExplanation, setOpenExplanation] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  const drawerAnimation = useRef(new Animated.Value(screenHeight)).current

  const goToPrevWeek = useCallback(() => {
    setCurrentWeekStart((prev) => prev.subtract(1, 'week'))
  }, [])

  const goToNextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => prev.add(1, 'week'))
  }, [])

  const weekEndDate = dayjs(currentWeekStart).add(6, 'day')
  const dateRangeText = `${currentWeekStart.format('DD/MM')} - ${weekEndDate.format('DD/MM')}`
  const isNextWeekInFuture = dayjs(currentWeekStart).add(1, 'week').isAfter(dayjs().startOf('week'))

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

  // Add overscroll handlers
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
    <Box type='background' className='flex flex-1 p-4 gap-4'>
      <Box type='accent' className='p-4 rounded-lg gap-4 items-center'>
        <Box className='flex flex-row items-center gap-2'>
          <Typography type='title'>SALAH TRACKER</Typography>
          <TouchableOpacity onPress={openExplanationDrawer}>
            <Info color={Colors[colorScheme ?? 'light'].icon} />
          </TouchableOpacity>
        </Box>

        <Box className='flex flex-row gap-2 items-center'>
          <TouchableOpacity className='bg-white rounded-full p-1' onPress={goToPrevWeek}>
            <ChevronLeft />
          </TouchableOpacity>
          <Typography className='py-1 px-2 rounded-lg bg-background dark:bg-background-dark'>
            {dateRangeText}
          </Typography>
          <TouchableOpacity
            className={cn('bg-white rounded-full p-1 opacity-100', {
              'opacity-50': isNextWeekInFuture
            })}
            onPress={goToNextWeek}
            disabled={isNextWeekInFuture}
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
        <Box type='accent' className='flex flex-1 p-4 rounded-lg gap-4'>
          <Box className='flex-1'>
            <WeeklyCard startDay={currentWeekStart} user={user} size='default' />
          </Box>
          <Statistics startDay={currentWeekStart} />
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
                className='absolute bottom-0 left-0 right-0 rounded-tl-3xl rounded-tr-3xl p-8 h-[620x] bg-background dark:bg-background-dark'
                style={{ transform: [{ translateY: drawerAnimation }] }}
              >
                <Box className='flex flex-row items-center gap-4 mb-4'>
                  <Info color={Colors[colorScheme ?? 'light'].icon} />
                  <Typography className='font-semibold text-lg'>
                    Prayer Status Explanation
                  </Typography>
                </Box>

                <Box className='gap-4'>
                  <Box className='flex flex-row items-start gap-4'>
                    <Box className='flex-1'>
                      <Typography className='font-semibold'>1. MET (Met Target):</Typography>
                      <Typography className='pl-4'>
                        • Displays the percentage of prayers completed for the week.
                      </Typography>
                      <Typography className='pl-4'>• 7 days x 5 daily prayer = 35</Typography>
                      <Typography className='pl-4'>
                        • (Total Prayers Completed / 35) × 100
                      </Typography>
                    </Box>
                  </Box>
                  <Box className='flex flex-row items-start gap-4'>
                    <Box className='flex-1'>
                      <Typography className='font-semibold'>2. Best Day:</Typography>
                      <Typography className='pl-4'>
                        • Highlights the day where all prayers were either performed on time (
                        <Typography className='text-green-500'>green</Typography>) or in jamaah (
                        <Typography className='text-cyan-500'>blue</Typography>) without any missed
                        prayers
                      </Typography>
                    </Box>
                  </Box>
                  <Box className='flex flex-row items-start gap-4'>
                    <Box className='flex-1'>
                      <Typography className='font-semibold'>3. Total Done:</Typography>
                      <Typography className='pl-4'>
                        • Shows the total number of prayers completed during the week
                      </Typography>
                    </Box>
                  </Box>
                  <Box className='flex flex-row items-start gap-4'>
                    <Box className='flex-1'>
                      <Typography className='font-semibold'>4. Legend Indicator:</Typography>
                      <Box className='flex flex-row items-center gap-4 pl-4'>
                        <Box className='size-5 rounded' style={{ backgroundColor: '#80b9fa' }} />
                        <Typography>Jamaah - Prayer performed in congregation</Typography>
                      </Box>
                      <Box className='flex flex-row items-center gap-4 pl-4'>
                        <Box className='size-5 rounded' style={{ backgroundColor: '#21cb5a' }} />
                        <Typography>On Time - Prayed on time (30 min)</Typography>
                      </Box>
                      <Box className='flex flex-row items-center gap-4 pl-4'>
                        <Box className='size-5 rounded' style={{ backgroundColor: '#d38b16' }} />
                        <Typography>Late - Completed after 30m of prescribed time</Typography>
                      </Box>
                      <Box className='flex flex-row items-center gap-4 pl-4'>
                        <Box className='size-5 rounded' style={{ backgroundColor: '#cd2222' }} />
                        <Typography>Missed - Prayer was not performed</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box className='flex flex-row items-center justify-center mt-4'>
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
