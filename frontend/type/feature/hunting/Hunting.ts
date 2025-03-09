import Users from "../auth/users"

export interface Hunting {
  id: number
  title: string
  description: string
  price: number
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
  user?: Users

}
