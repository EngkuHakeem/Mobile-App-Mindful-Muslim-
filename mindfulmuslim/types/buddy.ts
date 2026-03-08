import { User } from 'firebase/auth'

export type Buddy = {
  buddy: Partial<User>
  weekStartTimestamp: number
  weekEndTimestamp: number
  id: string
}
