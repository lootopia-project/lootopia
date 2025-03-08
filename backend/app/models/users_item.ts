import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Item from '#models/item'
export default class UsersItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare itemId: number

  @column()
  declare quantity: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Item)
  declare item: BelongsTo<typeof Item>
}
