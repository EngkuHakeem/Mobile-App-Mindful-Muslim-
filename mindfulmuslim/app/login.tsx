import Checkbox from 'expo-checkbox'
import { router } from 'expo-router'
import { ChevronRight, Lock, Mail } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  useColorScheme
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { Colors } from '@/constants/colors'
import { useAuthStore } from '@/store/auth'

export default function SignIn() {
  const { login, error, user } = useAuthStore()
  const colorScheme = useColorScheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [checked, setChecked] = useState(false)

  async function handleLogin() {
    await login(email, password)
  }

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user])

  return (
    <KeyboardAvoidingView
      className='flex-1'
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
      style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}
    >
      <SafeAreaView className='flex-1'>
        <Box type='background' className='flex-1 items-center gap-4 p-4 justify-center'>
          <Image
            className='bg-white size-36 rounded p-4'
            source={require('@/assets/images/logo.png')}
          />
          <Box className='flex gap-4 items-center justify-center flex-col w-full'>
            <Box className='gap-1 mb-10'>
              <Typography type='title'>Welcome Back</Typography>
              <Typography className='font-extralight'>sign in to access your account</Typography>
            </Box>
            {error && <Typography className='!text-red-500'>{error}</Typography>}
            <Box type='accent' className='w-full flex-row p-4 rounded-lg items-center'>
              <TextInput
                className='flex-1 text-white'
                placeholder='Enter your email'
                value={email}
                onChangeText={setEmail}
              />
              <Mail color={Colors[colorScheme ?? 'light'].icon} />
            </Box>
            <Box type='accent' className='flex-row p-4 rounded-lg items-center'>
              <TextInput
                className='flex-1 text-white'
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Lock color={Colors[colorScheme ?? 'light'].icon} />
            </Box>
            <Box className='flex flex-row justify-between items-center w-full'>
              <Box className='flex flex-row gap-2 items-center'>
                <Checkbox value={checked} onValueChange={setChecked} />
                <Typography className='text-xs' type='default'>
                  Remember me
                </Typography>
              </Box>
              {/* <Typography type='link'>Forgot password?</Typography> */}
            </Box>
            <Box className='w-full flex'>
              <TouchableOpacity
                className='flex items-center justify-center flex-row rounded-lg p-4 mt-24 bg-violet-600'
                onPress={handleLogin}
              >
                <Typography type='subtitle' className='text-white'>
                  Next
                </Typography>
                <ChevronRight color='#fff' />
              </TouchableOpacity>
            </Box>
            <Typography>
              New member?{' '}
              <Typography type='link' onPress={() => router.push('/register')}>
                Register now
              </Typography>
            </Typography>
          </Box>
        </Box>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
