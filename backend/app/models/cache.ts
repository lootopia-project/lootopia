import { BaseModel, column } from '@adonisjs/lucid/orm'

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
  declare map: number
}
