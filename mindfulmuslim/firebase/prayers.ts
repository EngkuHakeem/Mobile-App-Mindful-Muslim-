import { db } from '@/firebaseConfig'
import { PrayerModel } from '@/types/prayer'
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'

async function addPrayer(prayer: PrayerModel) {
  try {
    const prayerRef = await addDoc(collection(db, 'prayers'), {
      userUid: prayer.userUid,
      type: prayer.type,
      status: prayer.status,
      date: prayer.date,
      mosqueId: prayer.mosqueId
    })

    return prayerRef
  } catch (error) {
    console.error('Error adding prayer: ', error)
  }
}

async function getPrayers(userUid: string, date?: Date | [Date, Date]) {
  try {
    let prayersQuery = query(collection(db, 'prayers'), where('userUid', '==', userUid))

    if (date) {
      let startDate: Date | undefined = undefined
      let endDate: Date | undefined = undefined

      if (Array.isArray(date) && date.length === 2) {
        ;[startDate, endDate] = date
      } else if (!Array.isArray(date)) {
        startDate = endDate = date
      } else {
        console.warn('Invalid date format provided to getPrayers')
      }

      if (startDate && endDate) {
        const startOfDay = new Date(startDate)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(endDate)
        endOfDay.setHours(23, 59, 59, 999)

        prayersQuery = query(
          prayersQuery,
          where('date', '>=', startOfDay.getTime()),
          where('date', '<=', endOfDay.getTime())
        )
      }
    }

    const prayersSnapshot = await getDocs(prayersQuery)
    return prayersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as PrayerModel))
  } catch (error) {
    console.error('Error getting prayers: ', error)
    return []
  }
}

async function deletePrayer(prayerId: string) {
  try {
    const docRef = doc(db, 'prayers', prayerId)
    await deleteDoc(docRef)
    console.log('Prayer deleted successfully')
    return true
  } catch (error) {
    console.error('Error deleting prayer: ', error)
    return false
  }
}

export { addPrayer, getPrayers, deletePrayer }
