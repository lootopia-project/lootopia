import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Hunting from '#models/hunting'
import Cache from '#models/cache'
import SpotMap from '#models/spot_map'

export default class Map extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare skin: string

  @column()
  declare zone: string

  @column()
  declare scale_min: number

  @column()
  declare scale_max: number

  @column()
  declare huntingId: number

  @column()
  declare cacheId: number

  @hasOne(() => Cache)
  declare cache: HasOne<typeof Cache>

  @belongsTo(() => Hunting)
  declare hunting: BelongsTo<typeof Hunting>

  @hasMany(() => SpotMap)
  declare spotMap: HasMany<typeof SpotMap>
}
