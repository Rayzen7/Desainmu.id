import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'chats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sender').unsigned().notNullable()
      table.string('message').notNullable()
      table.string('image').nullable()
      table.integer('room_id').unsigned()
      table.integer('receiver').unsigned().notNullable()

      table.foreign('sender').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('receiver').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('room_id').references('id').inTable('room_chats').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
