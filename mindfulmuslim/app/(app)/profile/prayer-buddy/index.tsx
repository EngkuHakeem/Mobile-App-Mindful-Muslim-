import { openURL } from 'expo-linking'
import { useRouter } from 'expo-router'
import { User } from 'firebase/auth'
import { MessageCircleHeart } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Alert, Button, Dimensions, FlatList, TouchableOpacity, useColorScheme } from 'react-native'

import { Avatar } from '@/components/avatar'
import { Box } from '@/components/box'
import { BuddyWeekData } from '@/components/buddy-prayer/buddy-week-data'
import { Typography } from '@/components/typography'
import { getAcceptedBuddyById, getFirstBuddyCurrentWeek } from '@/firebase/buddies'
import { useAuthStore } from '@/store/auth'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

type BuddyCount = {
  user: Partial<User>
  count: number
}

export default function InviteFriend() {
  const router = useRouter()
  const { user } = useAuthStore()
  const colorScheme = useColorScheme()
  const screenHeight = Dimensions.get('window').height

  const [buddiesData, setBuddiesData] = useState<BuddyCount[]>([])
  const [currentBuddy, setCurrentBuddy] = useState<Partial<User>>()

  useEffect(() => {
    if (!user) return

    getAcceptedBuddyById(user.uid).then((buddies) => {
      const buddyMap = new Map<string, { user: (typeof buddies)[0]['buddy']; count: number }>()

      buddies.forEach((entry) => {
        const uid = entry.buddy.uid as string
        if (buddyMap.has(uid)) {
          buddyMap.get(uid)!.count += 1
        } else {
          buddyMap.set(uid, { user: entry.buddy, count: 1 })
        }
      })

      const uniqueBuddies = Array.from(buddyMap.values())

      setBuddiesData(uniqueBuddies)
    })

    getFirstBuddyCurrentWeek(user.uid).then((buddy) => {
      if (buddy) setCurrentBuddy(buddy.buddy)
    })

    return () => {
      setBuddiesData([])
      setCurrentBuddy(undefined)
    }
  }, [])

  function openReinviteModal(item: Partial<User>) {
    router.push(`/profile/prayer-buddy/request/modal/${item.uid}`)
  }

  function handleContact() {
    // @ts-expect-error - phoneNo is not defined in the type
    const url = `whatsapp://send?phone=6${currentBuddy?.phoneNo}`

    Alert.alert('Contact Buddy', `Contact ${currentBuddy?.displayName} on WhatsApp?`, [
      {
        text: 'Cancel'
      },
      {
        text: 'Okay',
        onPress: () => openURL(url).catch((err) => Alert.alert('Error', 'Unable to open WhatsApp'))
      }
    ])
  }

  const renderHistoryItem = ({ item }: { item: BuddyCount }) => (
    <Box type='card' className='flex flex-row justify-between items-center my-1'>
      <Box className='flex flex-row items-center gap-4'>
        <Avatar className='size-12' url={item.user.photoURL} displayName={item.user.displayName} />
        <Box className='flex flex-col'>
          <Typography>{item.user.displayName || item.user.email}</Typography>
          <Typography type='label'>Tracked {item.count} times</Typography>
        </Box>
      </Box>
      {currentBuddy === undefined && (
        <Button title='Invite' onPress={() => openReinviteModal(item.user)} />
      )}
    </Box>
  )

  return (
    <SafeAreaView
      className='flex-1 bg-background dark:bg-background-dark p-4'
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} translucent={false} />
      <Box type='background' className='flex-1'>
        <Box type='background' className='flex-1 gap-4 p-4'>
          <Box className='flex flex-row items-center justify-between'>
            <Typography type='title'>Pray Early Together</Typography>
          </Box>
          {currentBuddy ? (
            <>
              <Typography type='label'>In Progress</Typography>
              <Box type='card' className='gap-4'>
                <Box className='flex flex-row items-center justify-between'>
                  <Box className='flex flex-row items-center gap-4'>
                    <Avatar url={currentBuddy?.photoURL} className='size-16 rounded-full' />
                    <Typography>{currentBuddy?.displayName}</Typography>
                  </Box>
                  <Box className='flex flex-row items-center gap-4'>
                    <Typography>{user?.displayName || user?.email}</Typography>
                    <Avatar url={user?.photoURL} className='size-16 rounded-full' />
                  </Box>
                </Box>
                <Box className='flex flex-row items-center justify-between'>
                  <BuddyWeekData user={currentBuddy} />
                  <BuddyWeekData user={user} />
                </Box>
                <TouchableOpacity
                  onPress={handleContact}
                  className='self-center bg-green-800 px-4 py-2 rounded flex flex-row items-center gap-2'
                >
                  <MessageCircleHeart color='#fff' />
                  <Typography>Contact Buddy</Typography>
                </TouchableOpacity>
              </Box>
            </>
          ) : (
            <Box type='card'>
              <Typography type='label'>No buddy in progress</Typography>
            </Box>
          )}
          <Typography type='label'>History</Typography>
          {buddiesData.length > 0 ? (
            <Box style={{ height: screenHeight * 0.3 }} className='!p-0'>
              <FlatList
                data={buddiesData}
                renderItem={renderHistoryItem}
                keyExtractor={(item) => item.user.uid || ''}
                showsVerticalScrollIndicator={true}
              />
            </Box>
          ) : (
            <Box type='card'>
              <Typography type='label'>No buddy history</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </SafeAreaView>
  )
}
