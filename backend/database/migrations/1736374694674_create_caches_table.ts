import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'caches'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('img').notNullable()
      table.string('message').notNullable()
      table.boolean('visibility').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
