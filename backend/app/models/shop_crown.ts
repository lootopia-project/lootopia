import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ShopCrown extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare price: number

  @column()
  declare name: string

  @column()
  declare img: string

  @column()
  declare numberOfCrowns: number
}