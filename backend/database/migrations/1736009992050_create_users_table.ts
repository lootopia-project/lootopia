import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('name').notNullable()
      table.string('surname').notNullable()
      table.boolean('is_partner').notNullable()
      table.string('img').notNullable()
      table.string('nickname').notNullable()
      table.string('two_factor_secret', 500).nullable()
      table.string('two_factor_recovery_codes', 500).nullable()
      table.boolean('is_two_factor_enabled').defaultTo(false)
      table.integer('phone').notNullable()
      table.integer('crowns').notNullable().defaultTo(0)
      table.integer('ranking')
      
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
