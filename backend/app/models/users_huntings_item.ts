import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Item from '#models/item'
import Hunting from '#models/hunting'
export default class UsersHuntingItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number | null

  @column()
  declare itemId: number

  @column()
  declare huntingId: number | null

  @column()
  declare history: boolean

  @column()
  declare shop: boolean

  @column()
  declare price: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Item)
  declare item: BelongsTo<typeof Item>

  @belongsTo(() => Hunting)
  declare hunting: BelongsTo<typeof Hunting>
}
