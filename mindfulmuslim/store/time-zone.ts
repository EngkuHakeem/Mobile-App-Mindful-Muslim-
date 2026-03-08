import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TimeZone } from '@/types'

type TimeZoneState = {
  selectedZone: TimeZone | null
  loading: boolean
  setSelectedZone: (zone: TimeZone | null) => Promise<void>
  loadTimeZone: () => Promise<void>
}

export const useTimeZoneStore = create<TimeZoneState>((set) => ({
  selectedZone: null,
  loading: true,

  setSelectedZone: async (zone) => {
    try {
      if (zone) {
        await AsyncStorage.setItem('selectedZone', JSON.stringify(zone))
      } else {
        await AsyncStorage.removeItem('selectedZone')
      }
      set({ selectedZone: zone })
    } catch (error) {
      console.error('Error saving time zone:', error)
    }
  },

  loadTimeZone: async () => {
    set({ loading: true })
    try {
      const storedValue = await AsyncStorage.getItem('selectedZone')
      if (storedValue) {
        set({ selectedZone: JSON.parse(storedValue) })
      }
    } catch (error) {
      console.error('Error loading time zone:', error)
    } finally {
      set({ loading: false })
    }
  }
}))
