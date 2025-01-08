import { BaseModel, column } from '@adonisjs/lucid/orm'

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
  declare hunting: number
}
