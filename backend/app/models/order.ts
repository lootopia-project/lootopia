import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import OrdersItem from '#models/orders_item'
import UsersOrder from '#models/users_order'
export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @hasMany(() => OrdersItem)
  declare ordersItem: HasMany<typeof OrdersItem>

  @hasMany(() => UsersOrder)
  declare usersOrder: HasMany<typeof UsersOrder>
}
