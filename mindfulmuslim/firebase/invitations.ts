import { db } from '@/firebaseConfig'
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore'
import dayjs from 'dayjs'

type InvitationStatus = 'pending' | 'accepted' | 'declined'

type Invitation = {
  inviteeId: string
  inviterId: string
  status: InvitationStatus
}

async function addInvitation(invitation: Invitation) {
  try {
    const inviteRef = await addDoc(collection(db, 'invitations'), { ...invitation })

    return {
      id: inviteRef.id,
      ...invitation
    }
  } catch (error) {
    console.error('Error adding invitation: ', error)
    return null
  }
}

async function getInvitationsById(userId: string) {
  try {
    const prayersQuery = query(collection(db, 'invitations'), where('inviteeId', '==', userId))
    const invitationsSnapshot = await getDocs(prayersQuery)

    return invitationsSnapshot.docs.map((doc) => ({ ...doc.data() }))
  } catch (error) {
    console.error('Error getting invitations by ID: ', error)
    return []
  }
}

async function updateInvitation(invitationId: string, status: InvitationStatus) {
  try {
    const invitationRef = doc(db, 'invitations', invitationId)
    await updateDoc(invitationRef, {
      status,
      updatedAt: new Date()
    })

    if (status === 'accepted') {
      console.log('Invitation accepted, creating buddy data...')
      const invitationSnap = await getDoc(invitationRef)
      if (invitationSnap.exists()) {
        const invitation = invitationSnap.data() as Invitation

        const weekStart = dayjs().startOf('week').unix()
        const weekEnd = dayjs().endOf('week').unix()

        const buddyData = {
          createdAt: new Date(),
          weekStartTimestamp: weekStart,
          weekEndTimestamp: weekEnd
        }

        const data1 = await addDoc(collection(db, 'buddies'), {
          userId: invitation.inviterId,
          buddyId: invitation.inviteeId,
          ...buddyData
        })

        console.log('Buddy data for inviter created:', data1.id)

        const data2 = await addDoc(collection(db, 'buddies'), {
          userId: invitation.inviteeId,
          buddyId: invitation.inviterId,
          ...buddyData
        })

        console.log('Buddy data for invitee created:', data2.id)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating invitation: ', error)
    return { success: false, error }
  }
}

export { addInvitation, getInvitationsById, updateInvitation }
