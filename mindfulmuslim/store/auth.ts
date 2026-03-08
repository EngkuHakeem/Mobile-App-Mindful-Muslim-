import { create } from 'zustand'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth'
import { auth } from '@/firebaseConfig'

type AuthState = {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  error: string | null
  register: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => {
    set({ user })
  },
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      set({ user: userCredential.user, error: null })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      set({ user: userCredential.user, error: null })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  logout: async () => {
    try {
      await signOut(auth)
      set({ user: null, error: null })
    } catch (error: any) {
      set({ error: error.message })
    }
  }
}))

onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false })
})
