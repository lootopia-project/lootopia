import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users_huntings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('hunting_id').unsigned().references('id').inTable('huntings').onDelete('CASCADE')
      table.integer('score').notNullable()
      table.string('opinion').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
