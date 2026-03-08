import Checkbox from 'expo-checkbox'
import { launchImageLibraryAsync } from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { Camera, ChevronRight, Lock, Mail, Phone, User } from 'lucide-react-native'
import { useState } from 'react'
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
import { registerUser } from '@/firebase/users'
import { useAuthStore } from '@/store/auth'

export default function RegisterScreen() {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const { setUser } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [checked, setChecked] = useState(false)
  const [imageUri, setImageUri] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function pickImage() {
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  async function handleRegister() {
    setLoading(true)
    const user = await registerUser(email, password, displayName, imageUri, phone)
    setLoading(false)

    if (user) {
      setUser(user)
      router.replace('/')
    } else {
      setError('Registration failed. Please try again.')
    }
  }

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
            className='bg-white size-36 p-4 rounded'
            source={require('@/assets/images/logo.png')}
          />
          <Box>
            <Typography type='title'>Get Started</Typography>
            <Typography className='text-sm'>by creating a free account</Typography>
          </Box>
          <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center' }}>
            {imageUri ? (
              <Image
                className='bg-green-900 size-28 items-center justify-center rounded-full'
                source={{ uri: imageUri }}
              />
            ) : (
              <Box className='bg-green-900 size-28 items-center justify-center rounded-full'>
                <Typography>Upload</Typography>
                <Camera color={Colors[colorScheme ?? 'light'].icon} />
              </Box>
            )}
          </TouchableOpacity>
          <Box type='accent' className='w-full flex-row p-4 rounded-lg items-center'>
            <TextInput
              className='flex-1 text-white'
              placeholder='Enter your full name'
              value={displayName}
              onChangeText={setDisplayName}
            />
            <User color={Colors[colorScheme ?? 'light'].icon} />
          </Box>
          <Box type='accent' className='w-full flex-row p-4 rounded-lg items-center'>
            <TextInput
              className='flex-1 text-white'
              placeholder='Enter your email'
              value={email}
              onChangeText={setEmail}
            />
            <Mail color={Colors[colorScheme ?? 'light'].icon} />
          </Box>
          <Box type='accent' className='w-full flex-row p-4 rounded-lg items-center'>
            <TextInput
              className='flex-1 text-white'
              placeholder='Enter your phone number'
              value={phone}
              onChangeText={setPhone}
            />
            <Phone color={Colors[colorScheme ?? 'light'].icon} />
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
          <Box className='flex flex-row gap-2 items-center justify-start'>
            <Checkbox value={checked} onValueChange={setChecked} />
            <Box className='flex flex-row items-center'>
              <Typography className='text-xs' type='default'>
                By checking the checkbox you agree to our{' '}
                <Typography type='link' className='text-xs'>
                  Terms
                </Typography>{' '}
                and{' '}
                <Typography type='link' className='text-xs'>
                  Conditions
                </Typography>
              </Typography>
            </Box>
          </Box>
          <Box className='w-full flex'>
            {checked && (
              <TouchableOpacity
                disabled={loading}
                className='mt-5 flex items-center justify-center flex-row rounded-lg p-4 bg-violet-600'
                onPress={handleRegister}
              >
                <Typography type='subtitle' className='text-white'>
                  Next
                </Typography>
                <ChevronRight color='#fff' />
              </TouchableOpacity>
            )}
          </Box>
          <Typography>
            Already a member?{' '}
            <Typography type='link' onPress={() => router.push('/login')}>
              Log In
            </Typography>
          </Typography>
        </Box>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
