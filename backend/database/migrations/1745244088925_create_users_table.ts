import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('username').notNullable()
      table.string('image').nullable()
      table.string('email', 254).notNullable()
      table.string('password').notNullable()
      table.string('no_hp').nullable()
      table.string('date_of_birth').nullable()
      table.string('address').nullable()
      table.string('gender').nullable()
      table.integer('role_id').unsigned().notNullable()

      table.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
