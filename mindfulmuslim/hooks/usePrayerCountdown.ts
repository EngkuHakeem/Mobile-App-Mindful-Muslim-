import { useEffect, useRef, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { convertToComparableTime } from '@/lib/utils'
import { PrayerModel } from '@/types/prayer'
import { PrayerType } from '@/types'

interface UsePrayerCountdownProps {
  prayers: any[]
  selectedDate: Dayjs
}

function getNextPrayer(prayers: any[], selectedDate: Dayjs) {
  if (!prayers || !selectedDate) return null
  const day =
    typeof selectedDate.date === 'function' ? selectedDate.date() : Number(selectedDate.date)
  // @ts-expect-error - dayjs type issue
  const prayerIndex = day - 1
  if (prayerIndex < 0 || prayerIndex >= prayers.length) return null
  const todayPrayers = prayers[prayerIndex]
  if (!todayPrayers) return null
  const now = dayjs()
  const isToday = selectedDate.format('YYYY-MM-DD') === now.format('YYYY-MM-DD')
  if (!isToday) {
    return {
      name: 'Fajr',
      time: todayPrayers.fajr
    }
  }
  const prayers_ordered = [
    { name: 'Fajr', time: convertToComparableTime(todayPrayers.fajr) },
    { name: 'Dhuhr', time: convertToComparableTime(todayPrayers.dhuhr) },
    { name: 'Asr', time: convertToComparableTime(todayPrayers.asr) },
    { name: 'Maghrib', time: convertToComparableTime(todayPrayers.maghrib) },
    { name: 'Isha', time: convertToComparableTime(todayPrayers.isha) }
  ].filter((prayer) => prayer.time !== null)
  for (const prayer of prayers_ordered) {
    if (prayer.time && now.isBefore(prayer.time)) {
      return {
        name: prayer.name,
        time: todayPrayers[prayer.name.toLowerCase() as keyof typeof todayPrayers]
      }
    }
  }
  return {
    name: 'Fajr (Tomorrow)',
    time: prayers[(prayerIndex + 1) % prayers.length]?.fajr
  }
}

export function usePrayerCountdown({ prayers, selectedDate }: UsePrayerCountdownProps) {
  const [countdown, setCountdown] = useState('--:--:--')
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    function updateCountdown() {
      const nextPrayer = getNextPrayer(prayers, selectedDate)
      if (!nextPrayer || !nextPrayer.time) {
        setCountdown('--:--:--')
        return
      }
      const now = dayjs()
      let prayerTime: Dayjs | null = null
      if (typeof nextPrayer.time === 'number') {
        prayerTime = dayjs(nextPrayer.time * 1000)
      } else if (typeof nextPrayer.time === 'string') {
        const timePattern = /^\d{1,2}:\d{2}$/
        if (timePattern.test(nextPrayer.time)) {
          if (nextPrayer.name.includes('Tomorrow')) {
            const tomorrow = dayjs().add(1, 'day')
            prayerTime = dayjs(`${tomorrow.format('YYYY-MM-DD')} ${nextPrayer.time}`)
          } else {
            prayerTime = dayjs(`${now.format('YYYY-MM-DD')} ${nextPrayer.time}`)
          }
        }
      }
      if (!prayerTime) {
        setCountdown('--:--:--')
        return
      }
      const diff = prayerTime.diff(now, 'second')
      if (diff <= 0) {
        setCountdown('00:00:00')
        return
      }
      const hours = Math.floor(diff / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = diff % 60
      setCountdown(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`
      )
    }
    updateCountdown()
    intervalRef.current = window.setInterval(updateCountdown, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [prayers, selectedDate])

  return {
    countdown,
    nextPrayer: getNextPrayer(prayers, selectedDate)
  }
}
