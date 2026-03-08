import { Box } from '@/components/box'
import { FlatList, TouchableOpacity } from 'react-native'
import { Typography } from '@/components/typography'
import { getMosques, Mosque } from '@/firebase/mosques'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MasjidScreen() {
  const router = useRouter()
  const [mosqueList, setMosqueList] = useState<Mosque[]>([])

  useEffect(() => {
    getMosques().then((res) => setMosqueList((res as unknown as Mosque[]) || []))
    return () => setMosqueList([])
  }, [])

  function navigateToModal(mosqueId?: string) {
    if (!mosqueId) return

    router.push(`/profile/settings/masjid/modal/${mosqueId}`)
  }

  return (
    <SafeAreaView
      className='flex-1 bg-background dark:bg-background-dark'
      edges={['left', 'right']}
    >
      <Box type='background' className='p-4 flex-1'>
        {mosqueList.length === 0 ? (
          <Box className='flex-1 justify-center items-center'>
            <Typography type='label' className='text-center text-gray-400'>
              No masjid added yet
            </Typography>
          </Box>
        ) : (
          <FlatList
            data={mosqueList}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity className='mb-2' onPress={() => navigateToModal(item.id)}>
                <Box type='accent' className='p-4 rounded-lg'>
                  <Typography type='label'>{item.name}</Typography>
                  <Typography className='text-xs text-gray-300'>
                    {item.lat}, {item.lng}
                  </Typography>
                </Box>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Box>
    </SafeAreaView>
  )
}
