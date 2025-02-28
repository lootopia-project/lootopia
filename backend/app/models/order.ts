import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import OrdersReward from '#models/orders_reward'
import UsersOrder from '#models/users_order'
export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare status: string

  @column()
  declare finalPrice: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @hasMany(() => OrdersReward)
  declare ordersReward: HasMany<typeof OrdersReward>

  @hasMany(() => UsersOrder)
  declare usersOrder: HasMany<typeof UsersOrder>
}
