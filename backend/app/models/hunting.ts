import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import World from '#models/world'
import Whitelist from '#models/whitelist'
import UsersHunting from '#models/users_hunting'
import Reward from '#models/reward'
import Map from '#models/map'

export default class Hunting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare minUser: number

  @column()
  declare maxUser: number

  @column()
  declare private: boolean

  @column.dateTime()
  declare endDate: DateTime

  @column()
  declare searchDelay: string

  @column()
  declare status: boolean

  @column()
  declare background: string

  @column()
  declare textColor: string

  @column()
  declare headerImg: string

  @column()
  declare userId: number

  @column()
  declare worldId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => World)
  declare world: BelongsTo<typeof World>

  @hasMany(() => Whitelist)
  declare whitelist: HasMany<typeof Whitelist>

  @hasMany(() => UsersHunting)
  declare usersHunting: HasMany<typeof UsersHunting>

  @hasMany(() => Reward)
  declare reward: HasMany<typeof Reward>

  @hasMany(() => Map)
  declare map: HasMany<typeof Map>
}
