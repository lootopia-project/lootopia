import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Hunting from '#models/hunting'

export default class UsersHunting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare hunting_id: number

  @column()
  declare score: number

  @column()
  declare opinion: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Hunting)
  declare hunting: BelongsTo<typeof Hunting>
}
