import { db } from '@/firebaseConfig'
import { Buddy } from '@/types/buddy'
import { User } from 'firebase/auth'
import { collection, getDocs, query, where, doc, getDoc, orderBy, limit } from 'firebase/firestore'
import dayjs from 'dayjs'

async function getAcceptedBuddyById(id: string) {
  try {
    const buddiesQuery = query(collection(db, 'buddies'), where('userId', '==', id))
    const buddiesSnapshot = await getDocs(buddiesQuery)

    const buddies: Buddy[] = []

    for (const buddyDoc of buddiesSnapshot.docs) {
      const buddyData = buddyDoc.data()
      const buddyUserDoc = await getDoc(doc(db, 'users', buddyData.buddyId))

      if (buddyUserDoc.exists()) {
        buddies.push({
          ...buddyData,
          id: buddyDoc.id,
          buddy: {
            ...(buddyUserDoc.data() as User)
          }
        } as Buddy)
      }
    }

    return buddies
  } catch (error) {
    console.error('Error getting accepted buddy by ID: ', error)
    return []
  }
}

async function getFirstBuddyCurrentWeek(userId: string) {
  try {
    const startOfWeek = dayjs().startOf('week').unix()
    const endOfWeek = dayjs().endOf('week').unix()

    const buddiesQuery = query(
      collection(db, 'buddies'),
      where('userId', '==', userId),
      where('weekStartTimestamp', '>=', startOfWeek),
      where('weekStartTimestamp', '<=', endOfWeek),
      orderBy('weekStartTimestamp'),
      limit(1)
    )

    const userQuery = query(
      collection(db, 'buddies'),
      where('userId', '==', userId),
      where('weekStartTimestamp', '>=', startOfWeek),
      where('weekStartTimestamp', '<=', endOfWeek),
      orderBy('weekStartTimestamp'),
      limit(1)
    )

    const [snapshotBuddy, snapshotUser] = await Promise.all([
      getDocs(buddiesQuery),
      getDocs(userQuery)
    ])
    const docs = [...snapshotBuddy.docs, ...snapshotUser.docs]

    if (docs.length === 0) {
      console.log('No buddy data found for the current week')
      return null
    }

    const buddyDoc = docs.reduce((prev, curr) => {
      return prev.data().startWeek < curr.data().startWeek ? prev : curr
    })
    const buddyData = buddyDoc.data()

    const buddyUserDoc = await getDoc(doc(db, 'users', buddyData.buddyId))

    if (buddyUserDoc.exists()) {
      return {
        ...buddyData,
        id: buddyDoc.id,
        buddy: {
          ...(buddyUserDoc.data() as User)
        }
      } as Buddy
    }

    return null
  } catch (error) {
    console.error('Error getting first buddy of the current week: ', error)
    return null
  }
}

export { getAcceptedBuddyById, getFirstBuddyCurrentWeek }
