import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import Map from '#models/map'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import SpotCache from '#models/spot_cache'

export default class Cache extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare img: string

  @column()
  declare message: string

  @column()
  declare visibility: boolean

  @column()
  declare mapId: number

  @hasOne(() => Map)
  declare map: HasOne<typeof Map>

  @belongsTo(() => SpotCache)
  declare spotCache: BelongsTo<typeof SpotCache>
}
