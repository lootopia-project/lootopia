import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import TypeReward from '#models/type_reward'
import Rarity from '#models/rarity'
import Hunting from '#models/hunting'
import OrdersReward from '#models/orders_reward'

export default class Reward extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare rarityId: number

  @column()
  declare typeId: number

  @column()
  declare userId: number

  @column()
  declare huntingId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => TypeReward)
  declare type: BelongsTo<typeof TypeReward>

  @belongsTo(() => Rarity)
  declare rarity: BelongsTo<typeof Rarity>

  @belongsTo(() => Hunting)
  declare hunting: BelongsTo<typeof Hunting>

  @hasMany(() => OrdersReward)
  declare ordersReward: HasMany<typeof OrdersReward>
}
