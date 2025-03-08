import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import TypeItem from '#models/type_item'
import Rarity from '#models/rarity'
import Hunting from '#models/hunting'
import OrdersItem from '#models/orders_item'
import UsersItem from '#models/users_item'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare rarityId: number

  @column()
  declare typeId: number

  @column()
  declare price: number

  @column()
  declare description: string

  @column()
  declare img: string

  @column()
  declare huntingId: number

  @belongsTo(() => TypeItem)
  declare type: BelongsTo<typeof TypeItem>

  @belongsTo(() => Rarity)
  declare rarity: BelongsTo<typeof Rarity>

  @belongsTo(() => Hunting)
  declare hunting: BelongsTo<typeof Hunting>

  @hasMany(() => OrdersItem)
  declare ordersItem: HasMany<typeof OrdersItem>

  @hasMany(() => UsersItem)
  declare usersItem: HasMany<typeof UsersItem>
}
