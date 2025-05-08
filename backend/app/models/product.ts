import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Category from './category.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Comment from './comment.js'
import Transaction from './transaction.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare image: string

  @column()
  declare description: string

  @column()
  declare quantity: number

  @column()
  declare price: number

  @column()
  declare created_by: number

  @column()
  declare category_id: number

  @belongsTo(() => Category, { foreignKey: 'category_id' })
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => User, { foreignKey: 'created_by' })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Comment, { foreignKey: 'product_id' })
  declare comment: HasMany<typeof Comment>

  @hasMany(() => Transaction, { foreignKey: 'product_id' })
  declare transaction: HasMany<typeof Transaction>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
