import { Avatar } from '@/components/avatar'
import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { deleteMosque, getMosqueById, Mosque } from '@/firebase/mosques'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'
// import MapView from 'react-native-maps'

export default function ModalMasjidScreen() {
  const { id } = useLocalSearchParams()

  const [masjid, setMasjid] = useState<Mosque>()

  useEffect(() => {
    getMosqueById(id as string).then((res) => setMasjid(res as unknown as Mosque))

    return () => setMasjid(undefined)
  }, [id])

  async function handleDelete() {
    try {
      await deleteMosque(id as string)
      Alert.alert('Success', 'Mosque record deleted successfully.')
    } catch (error) {
      console.error('Error deleting mosque record:', error)
      Alert.alert('Error', 'Failed to delete mosque record. Please try again.')
    }
  }

  return (
    <Box type='background' className='flex-1 p-4 flex flex-col gap-4'>
      <Typography type='title' className='self-center'>
        {masjid?.name}
      </Typography>
      <Avatar
        url={masjid?.imageUri}
        displayName={masjid?.name}
        className='size-36 self-center rounded'
      />
      {/* <Box className='rounded-lg h-[300px] w-full mb-4'>
        <MapView style={{ width: '100%', height: '100%', borderRadius: 8 }} />
      </Box> */}
      <Box type='accent' className='p-4 rounded-lg flex-col items-center mb-4'>
        <Typography type='label'>Masjid Location</Typography>
        <Typography className='text-xs text-gray-300'>
          {masjid?.lat}, {masjid?.lng}
        </Typography>
      </Box>
      <TouchableOpacity onPress={handleDelete} className='self-center bg-red-500 p-4 rounded'>
        <Typography className='text-red-500'>Delete Masjid</Typography>
      </TouchableOpacity>
    </Box>
  )
}
