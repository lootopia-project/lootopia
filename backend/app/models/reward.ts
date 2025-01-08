import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import TypeReward from '#models/type_reward'
import Rarity from '#models/rarity'
import Hunting from '#models/hunting'

export default class Reward extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare rarity_id: number

  @column()
  declare type_id: number

  @column()
  declare user_id: number

  @column()
  declare hunting_id: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => TypeReward)
  declare type: BelongsTo<typeof TypeReward>

  @belongsTo(() => Rarity)
  declare rarity: BelongsTo<typeof Rarity>

  @belongsTo(() => Hunting)
  declare hunting: BelongsTo<typeof Hunting>

}
