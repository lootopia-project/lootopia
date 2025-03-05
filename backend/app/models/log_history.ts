import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Order from './order.js'
import { DateTime } from 'luxon'
export default class LogHistory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare log: string

  @column()
  declare userId: number

  @column()
  declare orderId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>
}
