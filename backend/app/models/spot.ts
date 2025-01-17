import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import TypeSpot from '#models/type_spot'
import UsersHunting from '#models/users_hunting'
import SpotCache from '#models/spot_cache'
import SpotMap from '#models/spot_map'

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
  declare typeId: number

  @belongsTo(() => TypeSpot)
  declare type_spot: BelongsTo<typeof TypeSpot>

  @hasMany(() => UsersHunting)
  declare users_hunting: HasMany<typeof UsersHunting>

  @hasMany(() => SpotCache)
  declare spot_cache: HasMany<typeof SpotCache>

  @hasMany(() => SpotMap)
  declare spot_map: HasMany<typeof SpotMap>

}
