import { ActivityIndicator, TouchableOpacity, useColorScheme } from 'react-native'

import { Avatar } from '@/components/avatar'
import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { Colors } from '@/constants/colors'
import { useAuthStore } from '@/store/auth'
import { User } from 'firebase/auth'
import { RefreshCw, UserRoundCheck, UserRoundX } from 'lucide-react-native'
import { useEffect, useState } from 'react'

export default function Request() {
  const { user } = useAuthStore()
  const colorScheme = useColorScheme()

  const [loading, setLoading] = useState(false)
  const [invitations, setInvitations] = useState<Partial<User>[]>([])

  useEffect(() => {
    setInvitations([
      {
        uid: '123',
        email: 'example@example.com',
        photoURL:
          'https://static.wikia.nocookie.net/kpop/images/6/64/Aespa_Winter_2025_SMTOWN_The_Culture%2C_The_Future_concept_photo_2.png/revision/latest?cb=20250114162401'
      },
      {
        uid: '456',
        email: 'friend@example.com',
        photoURL:
          'https://static.wikia.nocookie.net/kpop/images/6/64/Aespa_Winter_2025_SMTOWN_The_Culture%2C_The_Future_concept_photo_2.png/revision/latest?cb=20250114162401'
      }
    ])

    return () => {
      setInvitations([])
    }
  }, [])

  return (
    <Box type='background' className='flex-1 p-4 gap-4'>
      <Box className='flex flex-row justify-center'>
        <TouchableOpacity className='flex flex-row items-center gap-4 bg-accent dark:bg-accent-dark px-4 py-2 rounded-lg'>
          {loading ? (
            <ActivityIndicator size='small' />
          ) : (
            <RefreshCw size={20} color={Colors[colorScheme ?? 'light'].icon} />
          )}
          <Typography>Refresh</Typography>
        </TouchableOpacity>
      </Box>
      <Typography type='label'>Invitation</Typography>
      <Box type='card' className='gap-4'>
        {invitations.length > 0 ? (
          invitations.map((invitation) => (
            <Box key={invitation.uid} className='flex flex-row items-center justify-between gap-4'>
              <Box className='flex flex-row items-center gap-4'>
                <Avatar
                  className='size-12 rounded-full'
                  url={invitation.photoURL}
                  displayName={invitation.displayName ?? invitation.email}
                />
                <Typography>{invitation.email}</Typography>
              </Box>
              <Box className='flex flex-row items-center gap-4'>
                <TouchableOpacity>
                  <UserRoundX />
                </TouchableOpacity>
                <TouchableOpacity>
                  <UserRoundCheck />
                </TouchableOpacity>
              </Box>
            </Box>
          ))
        ) : (
          <Box className='flex flex-row items-center justify-center p-4'>
            <Typography type='label'>No invitations</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
