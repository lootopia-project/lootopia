import { Item } from './Item'
import { MapType } from './MapType'
import { Participant } from './Participant'

export interface HuntingDetailsProps {
  hunt: {
    id: number
    title: string
    description: string
    price: string | number
    minUser: number
    maxUser: number
    private: boolean
    endDate: string
    searchDelay: string
    status: boolean
    background: string
    textColor: string
    headerImg: string
    userId: number
    worldId: number
    items?: Item[]
    map?: MapType[]
    participantCount?: number
    participants?: Participant[]
    isOrganizer?: boolean
  }
  onClose: () => void
}
