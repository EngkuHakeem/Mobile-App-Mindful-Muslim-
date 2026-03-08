export const PRAYER_TIMES = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const
export const PRAYER_STATUS = ['ontime', 'late', 'missed', 'jamaah'] as const

export type PrayerType = (typeof PRAYER_TIMES)[number]
export type PrayerStatus = (typeof PRAYER_STATUS)[number]
export type TimeZone = {
  jakimCode: string
  negeri: string
  daerah: string
}

export type Prayer = {
  hijri: string
  day: number
  fajr: number
  syuruk: number
  dhuhr: number
  asr: number
  maghrib: number
  isha: number
}
