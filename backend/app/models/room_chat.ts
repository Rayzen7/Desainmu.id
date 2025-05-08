import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Chat from './chat.js'

export default class RoomChat extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sender: number

  @column()
  declare receiver: number

  @belongsTo(() => User, { foreignKey: 'sender' })
  declare sender_user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'receiver' })
  declare receiver_user: BelongsTo<typeof User>

  @hasMany(() => Chat, { foreignKey: 'room_id' })
  declare chat: HasMany<typeof Chat>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
