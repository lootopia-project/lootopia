import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('name').nullable()
      table.string('surname').nullable()
      table.boolean('is_partner').nullable().defaultTo(false)
      table.string('img').nullable()
      table.string('nickname').nullable().unique()
      table.string('two_factor_secret', 500).nullable()
      table.string('two_factor_recovery_codes', 500).nullable()
      table.boolean('is_two_factor_enabled').defaultTo(false)
      table.integer('phone').nullable()
      table.integer('crowns').nullable().defaultTo(0)
      table.integer('ranking').nullable()
      table.string('lang').nullable().defaultTo('en')
      table.boolean('check_mail').defaultTo(false)
      table.string('provider').nullable().defaultTo('mail')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
