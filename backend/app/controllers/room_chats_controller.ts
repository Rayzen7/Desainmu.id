import RoomChat from '#models/room_chat'
import { messagesProvider, roomChatValidate } from '#validators/post_validate'
import type { HttpContext } from '@adonisjs/core/http'

export default class RoomChatsController {
  /**
   * Display a list of resource
   */
  async index({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const { name } = request.qs()

    const roomChat = await RoomChat.query()
      .preload('sender_user')
      .preload('receiver_user')
      .preload('chat', (chatQuery) => {
        chatQuery.preload('sender_user').preload('receiver_user')
      })
      .where('sender', user.id)

    const filtered = name
      ? roomChat.filter((room) =>
          room.receiver_user?.username?.toLowerCase().includes(name.toLowerCase())
        )
      : roomChat

    return response.status(200).json({
      roomChat: filtered,
    })
  }

  async indexAdmin({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const { name } = request.qs()

    const roomChat = await RoomChat.query()
      .preload('sender_user')
      .preload('receiver_user')
      .preload('chat', (chatQuery) => {
        chatQuery.preload('sender_user').preload('receiver_user')
      })
      .where('receiver', user.id)

    const filtered = name
      ? roomChat.filter((room) =>
          room.sender_user?.username?.toLowerCase().includes(name.toLowerCase())
        )
      : roomChat

    return response.status(200).json({
      roomChat: filtered,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const validateData = await request.validateUsing(roomChatValidate, {
        messagesProvider,
      })

      const existingRoom = await RoomChat.query()
        .where((query) => {
          query.where('sender', user.id).andWhere('receiver', validateData.receiver)
        })
        .orWhere((query) => {
          query.where('sender', validateData.receiver).andWhere('receiver', user.id)
        })
        .first()

      if (existingRoom) {
        return response.status(400).json({
          message: 'Room already exist',
        })
      }

      const newRoom = await RoomChat.create({
        sender: user.id,
        receiver: validateData.receiver,
      })

      return response.status(200).json({
        message: 'Create Room Chat success',
        roomChat: newRoom,
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Create Room Chat failed',
      })
    }
  }
}
