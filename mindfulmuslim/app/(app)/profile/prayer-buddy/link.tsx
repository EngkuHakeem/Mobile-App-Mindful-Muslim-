import { setStringAsync } from 'expo-clipboard'
import { Copy, Heart } from 'lucide-react-native'
import { TextInput, TouchableOpacity } from 'react-native'

import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { getFirstBuddyCurrentWeek } from '@/firebase/buddies'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'expo-router'
import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Link() {
  const { user } = useAuthStore()
  const router = useRouter()

  const [invitationLink, setInvitationLink] = useState('')
  const [currentBuddy, setCurrentBuddy] = useState<Partial<User>>()

  useEffect(() => {
    if (!user) return

    getFirstBuddyCurrentWeek(user.uid).then((buddy) => {
      if (buddy) setCurrentBuddy(buddy.buddy)
    })

    return () => {
      setCurrentBuddy(undefined)
    }
  }, [])

  async function handleCopy() {
    await setStringAsync(user?.uid ?? '')
    // await setStringAsync('7Drekw8JK1Ryeok0CjwE0DqbxXv2')
    console.log(user?.uid)
    Alert.alert('Success!', 'Unique ID copied to clipboard')
  }

  async function handleInvitation() {
    router.push(`/profile/prayer-buddy/request/modal/${invitationLink}`)
  }

  return (
    <SafeAreaView
      className='flex-1 bg-background dark:bg-background-dark'
      edges={['left', 'right']}
    >
      <Box type='background' className='flex-1 gap-4 items-center p-4 justify-center pb-[100px]'>
        <Box type='card' className='p-4 flex flex-col gap-4 w-full'>
          <Typography>Copy your invitation code and share with your buddy</Typography>
          <TouchableOpacity
            className='p-3 rounded-2xl items-center bg-green-800'
            onPress={handleCopy}
          >
            <Box className='flex items-center flex-row gap-4'>
              <Copy color={'#fff'} size={16} />
              <Typography className='!text-white'>Copy Invitation Code</Typography>
            </Box>
          </TouchableOpacity>
        </Box>

        <Box
          type='card'
          className={cn('p-4 flex flex-col gap-4 w-full', {
            '!bg-red-900': currentBuddy
          })}
        >
          <Typography>
            {currentBuddy
              ? 'You are not allowed to have more than one buddy'
              : 'Paste your buddy invitation code here'}
          </Typography>
          <TextInput
            value={invitationLink}
            onChangeText={setInvitationLink}
            className={cn('w-full p-4 rounded-lg bg-white', {
              'bg-zinc-800': currentBuddy
            })}
            placeholderTextColor={'#999'}
            placeholder='Invitation link'
            editable={currentBuddy === undefined}
          />
          <TouchableOpacity
            className='p-3 rounded-2xl items-center bg-background dark:bg-background-dark'
            onPress={handleInvitation}
            disabled={!invitationLink || currentBuddy !== undefined}
          >
            <Box className='flex items-center flex-row gap-4'>
              <Heart color={'#ef1c79'} size={16} />
              <Typography className='!text-white'>Accept Invitation</Typography>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
    </SafeAreaView>
  )
}
