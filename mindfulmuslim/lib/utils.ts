import { Colors } from '@/constants/colors'
import { HADITHS_RECORD } from '@/constants/hadith'
import { PrayerStatus, PrayerType } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import dayjs, { Dayjs } from 'dayjs'
import { ColorSchemeName } from 'react-native'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatIslamicDate(date: Dayjs) {
  const day = date.format('DD')
  const monthNum = parseInt(date.format('M'))
  const year = date.format('YYYY')

  const islamicMonths = [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Jumada al-Awwal',
    'Jumada al-Thani',
    'Rajab',
    'Shaban',
    'Ramadan',
    'Shawwal',
    'Dhu al-Qadah',
    'Dhu al-Hijjah'
  ]

  const monthName =
    monthNum >= 1 && monthNum <= 12 ? islamicMonths[monthNum - 1] : `Month ${monthNum}`

  return `${day} ${monthName} ${year} Hijrah`
}

export function getDayRelativeText(date: Dayjs) {
  const now = dayjs()

  if (date.format('YYYY-MM-DD') === now.format('YYYY-MM-DD')) {
    return 'Today'
  }

  const yesterday = now.subtract(1, 'day')
  if (date.format('YYYY-MM-DD') === yesterday.format('YYYY-MM-DD')) {
    return 'Yesterday'
  }

  const tomorrow = now.add(1, 'day')
  if (date.format('YYYY-MM-DD') === tomorrow.format('YYYY-MM-DD')) {
    return 'Tomorrow'
  }

  const diffDays = date.diff(now, 'day')
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days ago`
  } else {
    return `In ${diffDays} days`
  }
}

export function getWeeklyDate() {
  const dates = []
  for (let i = -3; i <= 3; i++) {
    dates.push(dayjs().add(i, 'day').toCalendarSystem('gregory'))
  }
  return dates
}

export function formatPrayerTime(timestamp: number | string | undefined) {
  if (timestamp === undefined || timestamp === null) return 'N/A'

  if (typeof timestamp === 'number') {
    return dayjs(timestamp * 1000).format('hh:mm A')
  }

  if (typeof timestamp === 'string') {
    const timePattern = /^\d{1,2}:\d{2}$/
    if (timePattern.test(timestamp)) {
      return dayjs(`2000-01-01 ${timestamp}`).format('hh:mm A')
    }

    return timestamp
  }

  return 'Invalid time'
}

export function convertToComparableTime(timeStr: number) {
  return dayjs(timeStr * 1000)
}

export function startCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function getStatusColor(status: PrayerStatus | undefined, colorScheme: ColorSchemeName) {
  switch (status) {
    case 'ontime':
      return '#21cb5a'
    case 'missed':
      return '#cd2222'
    case 'late':
      return '#d38b16'
    case 'jamaah':
      return '#80b9fa'
    default:
      return Colors[colorScheme ?? 'light'].background
  }
}

export function getRandomHadith(prayerType: PrayerType) {
  const hadiths = (() => {
    switch (prayerType) {
      case 'fajr':
        return HADITHS_RECORD.fajr
      case 'dhuhr':
        return HADITHS_RECORD.dhuhr
      case 'asr':
        return HADITHS_RECORD.asr
      case 'maghrib':
        return HADITHS_RECORD.maghrib
      case 'isha':
        return HADITHS_RECORD.isha
    }
  })()

  const randomIndex = Math.floor(Math.random() * hadiths.length)
  return hadiths[randomIndex]
}
