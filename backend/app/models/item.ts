import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import TypeItem from '#models/type_item'
import Rarity from '#models/rarity'
import OrdersItem from '#models/orders_item'
import UsersHuntingItem from '#models/users_huntings_item'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare rarityId: number

  @column()
  declare typeItemId: number

  @column()
  declare price: number

  @column()
  declare description: string

  @column()
  declare img: string

  @column()
  declare shop: boolean

  @column()
  declare huntingId: number

  @belongsTo(() => TypeItem)
  declare type: BelongsTo<typeof TypeItem>

  @belongsTo(() => Rarity)
  declare rarity: BelongsTo<typeof Rarity>

  @hasMany(() => OrdersItem)
  declare ordersItem: HasMany<typeof OrdersItem>

  @hasMany(() => UsersHuntingItem)
  declare usershuntingItem: HasMany<typeof UsersHuntingItem>
}
