import { Rarity } from "./Rarity"

export interface Item {
    id: number
    name: string
    description: string
    img: string
    price: number
    rarity: Rarity
  }