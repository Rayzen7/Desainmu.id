import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import RoomChat from './room_chat.js'

export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sender: number

  @column()
  declare message: string

  @column()
  declare image: string

  @column()
  declare receiver: number

  @column()
  declare room_id: number

  @belongsTo(() => User, { foreignKey: 'sender' })
  declare sender_user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'receiver' })
  declare receiver_user: BelongsTo<typeof User>

  @belongsTo(() => RoomChat, { foreignKey: 'room_id' })
  declare room: BelongsTo<typeof RoomChat>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
