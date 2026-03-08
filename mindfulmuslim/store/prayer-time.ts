import { Prayer } from '@/types'
import { create } from 'zustand'

type PrayerTimeState = {
  prayers: Prayer[]
  setPrayers: (prayers: Prayer[]) => void
}

export const usePrayerTimeStore = create<PrayerTimeState>((set) => ({
  prayers: [],
  setPrayers: (prayers) => {
    set({ prayers })
  }
}))
