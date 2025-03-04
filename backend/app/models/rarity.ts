import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Item from '#models/item'

export default class Rarity extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => Item)
  declare item: HasMany<typeof Item>
}
