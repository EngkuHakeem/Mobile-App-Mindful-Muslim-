import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Slot, SplashScreen } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { ActivityIndicator, useColorScheme } from 'react-native'
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { AuthProvider } from '@/context/auth-provider'
import { useAuthStore } from '@/store/auth'

import '@/global.css'

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false
})

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
  })
  const { loading } = useAuthStore()

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return <Slot />

  if (loading)
    return (
      <Box className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' />
        <Typography>Loading...</Typography>
      </Box>
    )

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style='auto' />
          <Slot />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
