import { useRouter } from 'expo-router'
import { Button } from 'react-native'

export function AddButton() {
  const router = useRouter()

  return <Button title='Add' onPress={() => router.push('/profile/settings/add-masjid')} />
}
