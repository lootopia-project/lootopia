import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import OrdersItem from '#models/orders_item'
import Users from '#models/user'
import LogHistory from '#models/log_history'
export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare status: string

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @hasMany(() => OrdersItem)
  declare ordersItem: HasMany<typeof OrdersItem>

  @belongsTo(() => Users)
  declare usersOrder: BelongsTo<typeof Users>
  
  @hasMany(() => LogHistory)
  declare logHistory: HasMany<typeof LogHistory>
}
