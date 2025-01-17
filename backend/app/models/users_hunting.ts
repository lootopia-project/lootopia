import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Hunting from '#models/hunting'
import Spot from '#models/spot'

export default class UsersHunting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare huntingId: number

  @column()
  declare spotId: number

  @column()
  declare score: number

  @column()
  declare opinion: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Hunting)
  declare hunting: BelongsTo<typeof Hunting>

  @belongsTo(() => Spot)
  declare spot: BelongsTo<typeof Spot>
}
