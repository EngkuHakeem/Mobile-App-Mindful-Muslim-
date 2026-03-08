import { useRouter } from 'expo-router'
import { Button } from 'react-native'

export function InviteButton() {
  const router = useRouter()

  return <Button title='Invite' onPress={() => router.push('/profile/prayer-buddy/link')} />
}
