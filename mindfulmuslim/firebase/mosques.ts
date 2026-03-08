import { db, storage } from '@/firebaseConfig'
import { addDoc, collection, deleteDoc, getDocs, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export type Mosque = {
  id?: string
  name: string
  lat: number
  lng: number
  userId: string
  imageUri: string | null
}

async function addMosque(mosque: Mosque) {
  const imageUri = mosque.imageUri
  let photoURL = ''

  try {
    if (imageUri) {
      try {
        const response = await fetch(imageUri)
        const blob = await response.blob()

        const imageRef = ref(storage, `masjid/${mosque.id}.jpg`)
        await uploadBytes(imageRef, blob)

        photoURL = await getDownloadURL(imageRef)
      } catch (error) {
        console.error('Error uploading image: ', error)
      }
    }

    const mosqueRef = await addDoc(collection(db, 'mosques'), {
      name: mosque.name,
      lat: mosque.lat,
      lng: mosque.lng,
      userId: mosque.userId,
      imageUri: photoURL
    })

    return mosqueRef
  } catch (error) {
    console.error('Error adding mosque: ', error)
  }
}

async function getMosques() {
  try {
    const mosquesRef = collection(db, 'mosques')
    const mosquesSnapshot = await getDocs(mosquesRef)
    const mosquesList = mosquesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    return mosquesList as Mosque[]
  } catch (error) {
    console.error('Error getting mosques: ', error)
    return []
  }
}

async function getMosqueById(id: string) {
  try {
    const mosquesRef = collection(db, 'mosques')
    const mosqueSnapshot = await getDocs(mosquesRef)
    const mosque = mosqueSnapshot.docs.find((doc) => doc.id === id)

    return mosque ? mosque.data() : null
  } catch (error) {
    console.error('Error getting mosque by ID: ', error)
  }
}

async function updateMosque(id: string, updatedMosque: Partial<Mosque>) {
  try {
    const mosquesRef = collection(db, 'mosques')
    const mosqueSnapshot = await getDocs(mosquesRef)
    const mosqueDoc = mosqueSnapshot.docs.find((doc) => doc.id === id)

    if (mosqueDoc) {
      await updateDoc(mosqueDoc.ref, updatedMosque)
    }
  } catch (error) {
    console.error('Error updating mosque: ', error)
  }
}

async function deleteMosque(id: string) {
  try {
    const mosquesRef = collection(db, 'mosques')
    const mosqueSnapshot = await getDocs(mosquesRef)
    const mosqueDoc = mosqueSnapshot.docs.find((doc) => doc.id === id)

    if (mosqueDoc) {
      await deleteDoc(mosqueDoc.ref)
      return true
    }

    return false
  } catch (error) {
    console.error('Error deleting mosque: ', error)
    return false
  }
}

export { addMosque, getMosques, getMosqueById, updateMosque, deleteMosque }
