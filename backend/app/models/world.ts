import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Hunting from '#models/hunting'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class World extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => Hunting)
  declare huntings: HasMany<typeof Hunting>
}
