import { useLocalSearchParams, useRouter } from 'expo-router'
import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { Alert, Button, TouchableOpacity, Image } from 'react-native'

import { Avatar } from '@/components/avatar'
import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { getUserById } from '@/firebase/users'
import { useAuthStore } from '@/store/auth'
import { addInvitation, updateInvitation } from '@/firebase/invitations'

export default function ModalScreen() {
  const router = useRouter()
  const { uid } = useLocalSearchParams()
  const { user } = useAuthStore()

  const [userRequest, setUserRequest] = useState<User>()

  useEffect(() => {
    getUserById(uid as string).then((user) => setUserRequest(user as User))

    return () => {
      setUserRequest(undefined)
    }
  }, [uid])

  function handleBack() {
    router.back()
  }

  async function handleAccept() {
    if (!userRequest || !user) return

    const invitation = await addInvitation({
      inviterId: userRequest.uid,
      inviteeId: user.uid,
      status: 'accepted'
    })

    console.log('Invitation ID:', invitation)

    if (!invitation) {
      Alert.alert('Error', 'Failed to accept invitation')
      return
    }

    await updateInvitation(invitation?.id, 'accepted')

    Alert.alert('Success!', `You are now tracking with ${userRequest.displayName}`)
    router.back()
  }

  async function handleReject() {}

  return (
    <Box type='background' className='flex-1 flex flex-col p-4 items-center justify-center'>
      <Typography type='subtitle'>Pray Early Together</Typography>
      <Image source={require('@/assets/images/pray-together.png')} className='w-32 h-36' />
      <Box className='flex-1 gap-4 items-center justify-center'>
        <Typography type='subtitle'>
          {userRequest?.displayName ?? userRequest?.email} invites you to track together
        </Typography>
        <Box type='card' className='flex flex-row justify-between items-center w-full'>
          <Box className='items-center gap-4'>
            <Typography className='font-semibold'>
              {userRequest?.displayName ?? userRequest?.email}
            </Typography>
            <Avatar
              className='size-12'
              url={userRequest?.photoURL}
              displayName={userRequest?.displayName ?? userRequest?.email}
            />
          </Box>
          <Typography className='font-bold text-2xl'>&</Typography>
          <Box className='items-center gap-4'>
            <Typography className='font-semibold'>{user?.displayName ?? user?.email}</Typography>
            <Avatar
              className='size-12'
              url={user?.photoURL}
              displayName={user?.displayName ?? user?.email}
            />
          </Box>
        </Box>
        <Box className='flex flex-row gap-4 w-full'>
          <TouchableOpacity
            className='flex-1 items-center bg-accent dark:bg-accent-dark p-4 rounded'
            onPress={handleReject}
          >
            <Typography>Reject</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-1 items-center bg-tint dark:bg-tint-dark p-4 rounded'
            onPress={handleAccept}
          >
            <Typography>Accept</Typography>
          </TouchableOpacity>
        </Box>
      </Box>
      <Button title='Close' onPress={handleBack} />
    </Box>
  )
}
