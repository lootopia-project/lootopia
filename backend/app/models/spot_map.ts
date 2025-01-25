import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Spot from '#models/spot'
import Map from '#models/map'

export default class SpotMap extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare spotId: number

  @column()
  declare mapId: number

  @belongsTo(() => Spot)
  declare spot: BelongsTo<typeof Spot>

  @belongsTo(() => Map)
  declare map: BelongsTo<typeof Map>
}
