import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('image').notNullable()
      table.text('description').notNullable()
      table.integer('quantity').notNullable()
      table.integer('price').notNullable()
      table.integer('category_id').unsigned().notNullable()
      table.integer('created_by').unsigned().notNullable()

      table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE')
      table.foreign('created_by').references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
