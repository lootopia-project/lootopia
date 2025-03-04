import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Order from '#models/order'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Item from '#models/item'
export default class OrdersItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare itemId: number

  @column()
  declare price: number

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => Item)
  declare item: BelongsTo<typeof Item>
}
