import { auth, db, storage } from '@/firebaseConfig'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

type User = {
  name: string
  email: string
  phone: string
  password: string
}

async function addUser(user: User) {
  try {
    const userRef = await addDoc(collection(db, 'users'), {
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password
    })

    return userRef
  } catch (error) {
    console.error('Error adding user: ', error)
  }
}

async function getUsers() {
  try {
    const usersRef = collection(db, 'users')
    const usersSnapshot = await getDocs(usersRef)
    const usersList = usersSnapshot.docs.map((doc) => doc.data())

    return usersList
  } catch (error) {
    console.error('Error getting users: ', error)
  }
}

async function getUserById(uid: string) {
  try {
    const usersRef = collection(db, 'users')

    const userQuery = query(usersRef, where('uid', '==', uid))

    const usersSnapshot = await getDocs(userQuery)
    if (!usersSnapshot.empty) {
      return usersSnapshot.docs[0].data()
    } else {
      console.log('User not found')
      return null
    }
  } catch (error) {
    console.error('Error getting user by ID: ', error)
  }
}

async function updateUser(id: string, updatedUser: Partial<User>) {
  try {
    const userRef = collection(db, 'users')
    const userSnapshot = await getDocs(userRef)
    const userDoc = userSnapshot.docs.find((doc) => doc.id === id)

    if (userDoc) {
      await updateDoc(userDoc.ref, updatedUser)
    }
  } catch (error) {
    console.error('Error updating user: ', error)
  }
}

async function deleteUser(id: string) {
  try {
    const userRef = collection(db, 'users')
    const userSnapshot = await getDocs(userRef)
    const userDoc = userSnapshot.docs.find((doc) => doc.id === id)

    if (userDoc) {
      await deleteDoc(userDoc.ref)
    }
  } catch (error) {
    console.error('Error deleting user: ', error)
  }
}

async function registerUser(
  email: string,
  password: string,
  displayName: string,
  imageUri: string | null,
  phoneNo: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    let photoURL = ''

    if (imageUri) {
      try {
        const response = await fetch(imageUri)
        const blob = await response.blob()

        const imageRef = ref(storage, `profile_pics/${user.uid}.jpg`)
        await uploadBytes(imageRef, blob)

        photoURL = await getDownloadURL(imageRef)
      } catch (err) {
        console.error('Error uploading image:', err)
      }
    }

    await updateProfile(user, { displayName, photoURL })

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL,
      phoneNo,
      createdAt: new Date()
    })

    console.log('User registered:', user.uid)
    return user
  } catch (error) {
    console.error('Registration error:', error)
    return null
  }
}

export { addUser, deleteUser, getUserById, getUsers, registerUser, updateUser }
