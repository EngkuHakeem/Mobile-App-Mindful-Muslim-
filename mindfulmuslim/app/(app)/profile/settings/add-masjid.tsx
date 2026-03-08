import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { useState } from 'react'
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image
} from 'react-native'
// import MapView, { Marker } from 'react-native-maps'
import Location from 'expo-location'
import { Plus } from 'lucide-react-native'
import { addMosque } from '@/firebase/mosques'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'expo-router'
import { launchImageLibraryAsync } from 'expo-image-picker'

const latRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/
const lngRegex = /^[-+]?((1[0-7]\d)|(\d{1,2}))(\.\d+)?|180(\.0+)?$/

export default function AddMasjid() {
  const { user } = useAuthStore()
  const router = useRouter()

  const [latLng, setLatLng] = useState({
    latitude: 3.251195222597449,
    longitude: 101.73498137823117
  })
  const [masjidName, setMasjidName] = useState('')
  const [masjidLatitude, setMasjidLatitude] = useState('3.251195222597449')
  const [masjidLongitude, setMasjidLongitude] = useState('101.73498137823117')
  const [imageUri, setImageUri] = useState('')

  // TODO: test in ios simulator
  const getCurrentLocation = async () => {
    console.log('getCurrentLocation')
    let { status } = await Location.requestForegroundPermissionsAsync()
    console.log('status', status)
    if (status !== 'granted') {
      console.log('Permission to access location was denied')
      return
    }
    let location = await Location.getCurrentPositionAsync({})
    setLatLng({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    })
  }

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

  async function handleSaveMasjid() {
    if (!user) {
      Alert.alert('User not found')
      return
    }

    if (!masjidName) {
      Alert.alert('Masjid name is required')
      return
    }

    if (!latRegex.test(masjidLatitude) || !lngRegex.test(masjidLongitude)) {
      Alert.alert('Invalid latitude or longitude')
      return
    }

    await addMosque({
      name: masjidName,
      lat: parseFloat(masjidLatitude),
      lng: parseFloat(masjidLongitude),
      userId: user.uid,
      imageUri
    })

    Alert.alert('Masjid added successfully')
    router.back()
  }

  return (
    <KeyboardAvoidingView
      className='flex-1'
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <Box type='background' className='p-4 flex-1'>
        <ScrollView className='flex flex-col' keyboardShouldPersistTaps='handled'>
          <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', marginBottom: 16 }}>
            {imageUri ? (
              <Image
                className='bg-green-900 size-28 items-center justify-center rounded-full'
                source={{ uri: imageUri }}
              />
            ) : (
              <Box className='bg-green-900 size-28 items-center justify-center rounded-full'>
                <Typography>Upload Image</Typography>
              </Box>
            )}
          </TouchableOpacity>
          {/* <Box className='rounded-lg h-[300px] w-full mb-4'>
            <MapView
              style={{ width: '100%', height: '100%', borderRadius: 8 }}
              region={
                latRegex.test(masjidLatitude) && lngRegex.test(masjidLongitude)
                  ? {
                      latitude: parseFloat(masjidLatitude),
                      longitude: parseFloat(masjidLongitude),
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005
                    }
                  : {
                      latitude: 0,
                      longitude: 0,
                      latitudeDelta: 100,
                      longitudeDelta: 100
                    }
              }
            >
              {latRegex.test(masjidLatitude) && lngRegex.test(masjidLongitude) && (
                <Marker
                  coordinate={{
                    latitude: parseFloat(masjidLatitude),
                    longitude: parseFloat(masjidLongitude)
                  }}
                  title={masjidName || 'Masjid Location'}
                />
              )}
            </MapView>
          </Box> */}
          <Typography type='label' className='mb-2'>
            Masjid Name
          </Typography>
          <Box type='accent' className='p-4 rounded-lg flex-row items-center mb-4'>
            <TextInput
              style={{ color: '#fff' }}
              value={masjidName}
              onChange={(e) => setMasjidName(e.nativeEvent.text)}
              className='w-full'
              placeholder='e.g. Masjid Salahuddin'
            />
          </Box>
          <Typography type='label' className='mb-2'>
            Masjid Location (Latitude, Longitude)
          </Typography>
          <Box type='accent' className='p-4 rounded-lg flex-row items-center mb-4'>
            <TextInput
              style={{ color: '#fff' }}
              value={masjidLatitude.toString()}
              onChange={(e) => setMasjidLatitude(e.nativeEvent.text)}
              className='w-full'
              placeholder='3.1236253'
            />
          </Box>
          <Box type='accent' className='p-4 rounded-lg flex-row items-center mb-4'>
            <TextInput
              style={{ color: '#fff' }}
              value={masjidLongitude.toString()}
              onChange={(e) => setMasjidLongitude(e.nativeEvent.text)}
              className='w-full'
              placeholder='101.1231'
            />
          </Box>
          <TouchableOpacity
            className='rounded bg-green-500 px-4 py-2 self-center flex flex-row items-center gap-2'
            onPress={handleSaveMasjid}
          >
            <Plus color={'#fff'} size={20} />
            <Typography>Save Masjid</Typography>
          </TouchableOpacity>
        </ScrollView>
      </Box>
    </KeyboardAvoidingView>
  )
}
