import { PrayerModel } from '@/types/prayer'
import { Box } from '../box'
import { Typography } from '../typography'
import dayjs from 'dayjs'
import { getMosqueById, Mosque } from '@/firebase/mosques'
import { useEffect, useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import { deletePrayer } from '@/firebase/prayers'

export function PrayerDetails({
  prayer,
  handleClose
}: {
  prayer?: PrayerModel
  handleClose: () => void
}) {
  if (!prayer) return null
  const [mosquePrayed, setMosquePrayed] = useState<Mosque>()

  useEffect(() => {
    if (!prayer.mosqueId) return

    getMosqueById(prayer.mosqueId).then((res) => setMosquePrayed(res as unknown as Mosque))

    return () => {
      setMosquePrayed(undefined)
    }
  }, [prayer.mosqueId])

  async function handleDelete() {
    if (!prayer?.id) return

    try {
      await deletePrayer(prayer.id)
      Alert.alert('Success', 'Prayer record deleted successfully.')
      handleClose()
    } catch (error) {
      console.error('Error deleting prayer record:', error)
      Alert.alert('Error', 'Failed to delete prayer record. Please try again.')
    }
  }

  return (
    <Box className='flex flex-col items-center justify-between'>
      {/* <Typography>{JSON.stringify({ ...prayer, mosque: mosquePrayed }, null, 2)}</Typography> */}
      <Typography>Prayed on {dayjs(prayer.date).format('HH:mm:ss')}</Typography>
      {mosquePrayed && (
        <Box>
          <Typography>Prayed at {mosquePrayed.name}</Typography>
        </Box>
      )}
      <TouchableOpacity onPress={handleDelete} className='p-4 rounded bg-red-500 mt-4'>
        <Typography>Delete Record</Typography>
      </TouchableOpacity>
    </Box>
  )
}
