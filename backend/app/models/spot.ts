import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import TypeSpot from '#models/type_spot'

export default class Spot extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare lat: number

  @column()
  declare long: number

  @column()
  declare description: string

  @column()
  declare type: number

  @belongsTo(() => TypeSpot)
  declare type_spot: BelongsTo<typeof TypeSpot>

}
