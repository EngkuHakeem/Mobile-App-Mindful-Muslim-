import { PrayerStatus, PrayerType } from '@/types'

export type PrayerModel = {
  id?: string
  userUid: string
  type: PrayerType
  status: PrayerStatus
  date: number
  mosqueId: string | null
}
