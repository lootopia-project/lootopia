import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Spot from '#models/spot'
import Cache from '#models/cache'

export default class SpotCache extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare spotId: number

  @column()
  declare cacheId: number

  @belongsTo(() => Spot)
  declare spot: BelongsTo<typeof Spot>

  @belongsTo(() => Cache)
  declare cache: BelongsTo<typeof Cache>
}
