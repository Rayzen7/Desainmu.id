import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.integer('product_id').unsigned().notNullable()
      table.integer('quantity').notNullable()
      table.integer('total').notNullable()
      table.enum('status', ['packed', 'delivered', 'finished', 'canceled']).defaultTo('packed')
      table.string('delivered_status_1').nullable()
      table.string('delivered_status_2').nullable()
      table.string('delivered_status_3').nullable()
      table.string('delivered_status_4').nullable()

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
