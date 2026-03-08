import { useRouter } from 'expo-router'
import { Check } from 'lucide-react-native'
import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'

import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { useTimeZoneStore } from '@/store/time-zone'
import { TimeZone } from '@/types'
import { SafeAreaView } from 'react-native-safe-area-context'

type HeaderItem = {
  type: 'header'
  negeri: string
  id: string
}

type ListItem = TimeZone | HeaderItem

export default function TimeSelect() {
  const [zones, setZones] = useState<TimeZone[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedZone, setSelectedZone, loadTimeZone } = useTimeZoneStore()

  const router = useRouter()

  useEffect(() => {
    loadTimeZone()

    async function fetchTimeZones() {
      try {
        const response = await fetch('https://api.waktusolat.app/zones')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setZones(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching time zones:', error)
        setLoading(false)
      }
    }

    fetchTimeZones()

    return () => {
      setZones([])
    }
  }, [])

  const groupedZones = useMemo(() => {
    const grouped: { [key: string]: TimeZone[] } = {}

    zones.forEach((zone) => {
      if (!grouped[zone.negeri]) {
        grouped[zone.negeri] = []
      }
      grouped[zone.negeri].push(zone)
    })

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([negeri, zones]) => ({
        negeri,
        data: zones.sort((a, b) => a.daerah.localeCompare(b.daerah))
      }))
  }, [zones])

  const groupedZonesForList = useMemo(() => {
    const result: ListItem[] = []

    groupedZones.forEach((group, groupIndex) => {
      result.push({
        type: 'header',
        negeri: group.negeri,
        id: `header-${groupIndex}`
      })

      result.push(...group.data)
    })

    return result
  }, [groupedZones])

  const handleSelectZone = async (zone: TimeZone) => {
    await setSelectedZone(zone)
    router.back()
  }

  const renderItem = ({ item }: { item: ListItem }) => {
    if ('type' in item && item.type === 'header') {
      return (
        <Box className='p-2.5 bg-[#212121]'>
          <Typography type='label'>{item.negeri}</Typography>
        </Box>
      )
    }

    const timeZone = item as TimeZone
    const isSelected = selectedZone?.jakimCode === timeZone.jakimCode

    return (
      <TouchableOpacity
        className={`p-4 border-b border-b-[#eee] flex-row justify-between ${
          isSelected ? 'bg-blue-100/10' : ''
        }`}
        onPress={() => handleSelectZone(timeZone)}
      >
        <Typography>{timeZone.daerah}</Typography>
        {isSelected && <Check color='#0077FF' />}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView
      className='flex-1 bg-background dark:bg-background-dark'
      edges={['left', 'right']}
    >
      <Box type='background' className='w-full flex-1'>
        {loading ? (
          <Box className='flex-1 justify-center items-center'>
            <ActivityIndicator />
            <Typography>Loading time zones...</Typography>
          </Box>
        ) : (
          <>
            {zones.length > 0 ? (
              <FlatList
                data={groupedZonesForList}
                keyExtractor={(item) => ('type' in item ? item.id : item.jakimCode)}
                renderItem={renderItem}
                className='flex-1'
              />
            ) : (
              <Box className='flex-1 justify-center items-center'>
                <Typography>No time zones available</Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </SafeAreaView>
  )
}
