import { Colors } from '@/constants/colors'
import { addPrayer, getPrayers } from '@/firebase/prayers'
import calendarSystemsPlugin from '@calidy/dayjs-calendarsystems'
import HijriCalendarSystem from '@calidy/dayjs-calendarsystems/calendarSystems/HijriCalendarSystem'
import dayjs, { type Dayjs } from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRouter } from 'expo-router'
import { ArrowLeft, Bell, ExternalLink } from 'lucide-react-native'
import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Box } from '@/components/box'
import { PrayerAction } from '@/components/prayer-action'
import { PrayerButton } from '@/components/prayer-button'
import { Typography } from '@/components/typography'
import ThemedButton from '@/components/ui/button'
import { Hadith } from '@/constants/hadith'
import { getMosques, Mosque } from '@/firebase/mosques'
import {
  cn,
  convertToComparableTime,
  formatIslamicDate,
  formatPrayerTime,
  getDayRelativeText,
  getRandomHadith,
  getWeeklyDate,
  startCase
} from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { usePrayerTimeStore } from '@/store/prayer-time'
import { useTimeZoneStore } from '@/store/time-zone'
import { PRAYER_STATUS, PRAYER_TIMES, PrayerStatus, type PrayerType } from '@/types'
import type { PrayerModel } from '@/types/prayer'
import { Avatar } from '@/components/avatar'
import { PrayerDetails } from '@/components/prayer/details'
import { usePrayerCountdown } from '@/hooks/usePrayerCountdown'
import { MissedPrayerModal } from '@/components/MissedPrayerModal'

dayjs.extend(relativeTime)
dayjs.extend(calendar)
dayjs.extend(calendarSystemsPlugin)
dayjs.registerCalendarSystem('islamic', new HijriCalendarSystem())

export default function Index() {
  const colorScheme = useColorScheme()
  const screenHeight = Dimensions.get('window').height
  const { user } = useAuthStore()
  const { selectedZone, loadTimeZone } = useTimeZoneStore()
  const { prayers, setPrayers } = usePrayerTimeStore()
  const router = useRouter()

  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerType>()
  const [showMosqueList, setShowMosqueList] = useState(false)
  const [showMissedMessage, setShowMissedMessage] = useState(false)
  const [lastFetchedYear, setLastFetchedYear] = useState<number | null>(null)
  const [lastFetchedMonth, setLastFetchedMonth] = useState<number | null>(null)
  const [selectedDatePrayers, setSelectedDatePrayers] = useState<PrayerModel[]>([])
  const [missedPrayerHadith, setMissedPrayerHadith] = useState<Hadith>()
  const [showLoading, setShowLoading] = useState(false)
  const [mosqueData, setMosqueData] = useState<Mosque[]>([])

  const drawerAnimation = useRef(new Animated.Value(screenHeight)).current

  useEffect(() => {
    loadTimeZone()
  }, [])

  useEffect(() => {
    if (!selectedDate || !user) return

    getPrayers(user?.uid, selectedDate.toDate()).then((prayers) => setSelectedDatePrayers(prayers))
    getMosques().then((mosques) => setMosqueData(mosques))

    return () => {
      setSelectedDatePrayers([])
      setMosqueData([])
    }
  }, [selectedDate])

  useEffect(() => {
    if (!selectedZone) return

    async function fetchSelectedMonthPrayerTimes() {
      const currentYear = selectedDate.year()
      const currentMonth = selectedDate.month() + 1

      if (lastFetchedYear === currentYear && lastFetchedMonth === currentMonth) return

      try {
        const response = await fetch(
          `https://api.waktusolat.app/v2/solat/${selectedZone?.jakimCode}?year=${currentYear}&month=${currentMonth}`
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setPrayers(data.prayers)

        setLastFetchedYear(currentYear)
        setLastFetchedMonth(currentMonth)
      } catch (error) {
        console.error('Error fetching prayer times:', error)
      }
    }

    fetchSelectedMonthPrayerTimes()

    return () => {}
  }, [selectedDate, selectedZone])

  const islamicDate = selectedDate.toCalendarSystem('islamic')
  const gregoryDate = selectedDate.toCalendarSystem('gregory')
  const dayRelativeText = getDayRelativeText(selectedDate)
  const dates = getWeeklyDate()

  async function handleRefresh() {
    if (!user) return

    const prayers = await getPrayers(user?.uid, selectedDate.toDate())
    setSelectedDatePrayers(prayers)
  }

  function openDrawer(prayerName: PrayerType) {
    setSelectedPrayer(prayerName)
    setDrawerVisible(true)
    setShowMosqueList(false)
    Animated.timing(drawerAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start()
  }

  function handleStatusSelection(status?: PrayerStatus) {
    if (!selectedPrayer || !status) return
    if (status === 'jamaah') {
      showMosqueSelection()
      return
    }

    const formattedDate = selectedDate.format('MMMM D, YYYY')
    const prayerName = startCase(selectedPrayer)

    if (status !== 'missed') {
      Alert.alert(
        `${prayerName} Prayer`,
        `You marked ${prayerName} prayer as ${status} on ${formattedDate}.`,
        [
          {
            text: 'OK',
            onPress: async () => {
              if (user && selectedPrayer) {
                await addPrayer({
                  userUid: user.uid,
                  date: selectedDate.toDate().getTime(),
                  type: selectedPrayer,
                  mosqueId: null,
                  status: status
                })
              }
              closeDrawer()
            }
          }
        ]
      )
    } else {
      handleMissedPrayer()
    }
  }

  async function closeDrawer() {
    Animated.timing(drawerAnimation, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setDrawerVisible(false)
      setShowMosqueList(false)
      handleRefresh()
    })
  }

  function showMosqueSelection() {
    setShowMosqueList(true)
  }

  function goBackToOptions() {
    setShowMosqueList(false)
  }

  async function handleMissedPrayer() {
    if (!selectedPrayer) return

    if (selectedPrayer) {
      const hadith = getRandomHadith(selectedPrayer)
      setMissedPrayerHadith(hadith)
    }

    if (user) {
      await addPrayer({
        userUid: user.uid,
        date: selectedDate.toDate().getTime(),
        type: selectedPrayer,
        mosqueId: null,
        status: 'missed'
      })
    }

    await closeDrawer()
    setTimeout(() => {
      setShowMissedMessage(true)
    }, 300)
  }

  function selectMosque(mosque: Mosque) {
    if (!selectedPrayer) return

    const formattedDate = selectedDate.format('MMMM D, YYYY')
    const prayerName = startCase(selectedPrayer)

    Alert.alert(
      `${prayerName} Prayer in Jamaah`,
      `You prayed ${prayerName} in jamaah at ${mosque.name} on ${formattedDate}.`,
      [
        {
          text: 'OK',
          onPress: async () => {
            if (user && selectedPrayer) {
              await addPrayer({
                userUid: user.uid,
                date: selectedDate.toDate().getTime(),
                type: selectedPrayer,
                mosqueId: mosque.id as string,
                status: 'jamaah'
              })
            }
            closeDrawer()
          }
        }
      ]
    )
  }

  function dismissMissedMessage() {
    setShowMissedMessage(false)
  }

  function navigateSelectTimeZone() {
    router.push('/profile/settings/time-zone-select')
  }

  function isSelected(date: Dayjs) {
    return date.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
  }

  function renderMosqueItem({ item }: { item: Mosque }) {
    return (
      <TouchableOpacity
        className='p-4 rounded-lg my-1 flex flex-row items-center bg-accent dark:bg-accent-dark'
        onPress={() => selectMosque(item)}
      >
        <Box type='tint' className='flex justify-center items-center mr-4 rounded-full size-10'>
          <Avatar url={item.imageUri} displayName={item.name} className='size-10' />
        </Box>
        <Typography>{item.name}</Typography>
      </TouchableOpacity>
    )
  }

  function getPrayerDataForType(type: PrayerType): PrayerModel | undefined {
    if (!selectedDatePrayers || selectedDatePrayers.length === 0) return undefined
    const prayersOfType = selectedDatePrayers.filter((prayer) => prayer.type === type)

    if (prayersOfType.length === 0) return undefined
    return prayersOfType.reduce((latest, current) =>
      latest.date > current.date ? latest : current
    )
  }

  async function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset } = event.nativeEvent
    if (contentOffset.y < -30) {
      setShowLoading(true)
      await handleRefresh()
    }
  }

  function handleScrollEnd() {
    setShowLoading(false)
  }

  const { countdown, nextPrayer } = usePrayerCountdown({ prayers, selectedDate })

  return (
    <SafeAreaView
      className='flex-1 bg-background dark:bg-background-dark'
      edges={['top', 'left', 'right']}
    >
      <MissedPrayerModal
        visible={showMissedMessage}
        userName={user?.displayName ?? user?.email}
        prayerName={selectedPrayer}
        hadith={missedPrayerHadith}
        onDismiss={dismissMissedMessage}
      />
      <Box className='p-6 flex flex-col items-center gap-2 bg-green-800'>
        <Box className='w-full items-center justify-between flex flex-row'>
          <Box>
            <Typography>
              {dayRelativeText}, {gregoryDate.format('D MMMM')}
            </Typography>
            <Typography>{formatIslamicDate(islamicDate)}</Typography>
          </Box>
          <Box>
            <Typography className='text-2xl font-light text-right'>
              {countdown === '00:00:00' ? '--:--:--' : countdown}
            </Typography>
            <Typography
              className={cn('text-right', {
                'text-red-400':
                  countdown.split(':')[0] === '00' && parseInt(countdown.split(':')[1]) <= 15
              })}
            >
              {nextPrayer?.name} {formatPrayerTime(nextPrayer?.time)}
            </Typography>
          </Box>
        </Box>
        <Box className='w-full flex-row justify-between mt-4 bg-transparent'>
          {dates.map((date) => (
            <TouchableOpacity
              key={date.format('YYYY-MM-DD')}
              onPress={() => setSelectedDate(date)}
              className={cn('justify-center items-center rounded-lg size-12 bg-white', {
                'bg-blue-500': isSelected(date)
              })}
            >
              <Typography
                className={cn('text-sm !text-black', {
                  '!text-white': isSelected(date)
                })}
              >
                {date.format('D')}
              </Typography>
              <Typography
                className={cn('text-xs !text-black', {
                  '!text-white': isSelected(date)
                })}
              >
                {date.format('MMM').toUpperCase()}
              </Typography>
            </TouchableOpacity>
          ))}
        </Box>
      </Box>
      <Box className='flex-1 p-6'>
        {!selectedZone && selectedDate.date() && (
          <TouchableOpacity onPress={navigateSelectTimeZone}>
            <Box className='flex flex-row items-center justify-between'>
              <Typography>Select time zone</Typography>
              <ExternalLink />
            </Box>
          </TouchableOpacity>
        )}
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
          <Box className='gap-2'>
            <Typography type='subtitle'>Prayers</Typography>
            {PRAYER_TIMES.map((prayer) => {
              const prayerData = getPrayerDataForType(prayer)

              return (
                <PrayerButton
                  key={prayer}
                  title={startCase(prayer)}
                  prayerType={prayer}
                  onPress={() => openDrawer(prayer)}
                  status={prayerData?.status}
                />
              )
            })}
          </Box>
        </ScrollView>
      </Box>

      <Modal
        transparent={true}
        visible={drawerVisible}
        animationType='none'
        onRequestClose={closeDrawer}
      >
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <Box className='flex-1 bg-black/50'>
            <TouchableWithoutFeedback>
              <Animated.View
                className='absolute bottom-0 left-0 right-0 rounded-tl-2xl rounded-tr-2xl p-6 bg-background dark:bg-background-dark'
                style={{
                  height: showMosqueList ? screenHeight * 0.7 : 400,
                  transform: [{ translateY: drawerAnimation }]
                }}
              >
                {!showMosqueList ? (
                  <>
                    {getPrayerDataForType(selectedPrayer as PrayerType) ? (
                      <PrayerDetails
                        handleClose={closeDrawer}
                        prayer={getPrayerDataForType(selectedPrayer as PrayerType)}
                      />
                    ) : (
                      <>
                        <Typography className='text-xl font-bold mb-4'>
                          How did you pray {selectedPrayer} today?
                        </Typography>
                        {PRAYER_STATUS.map((status) => (
                          <PrayerAction
                            key={status}
                            onPress={() => handleStatusSelection(status)}
                            status={status}
                          />
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Box className='flex flex-row items-center mb-4'>
                      <TouchableOpacity className='p-2 mr-2' onPress={goBackToOptions}>
                        <ArrowLeft size={24} color={Colors[colorScheme ?? 'light'].text} />
                      </TouchableOpacity>
                      <Typography className='text-xl font-bold'>
                        Where did you pray today?
                      </Typography>
                    </Box>

                    <FlatList
                      data={mosqueData}
                      renderItem={renderMosqueItem}
                      keyExtractor={(item) => item.id || ''}
                      showsVerticalScrollIndicator={true}
                      contentContainerStyle={{ paddingBottom: 20 }}
                    />
                  </>
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          </Box>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  )
}
