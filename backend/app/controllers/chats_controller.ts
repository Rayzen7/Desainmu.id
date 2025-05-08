import type { HttpContext } from '@adonisjs/core/http'
import { chatValidate, messagesProvider } from '#validators/post_validate'
import Chat from '#models/chat'
import app from '@adonisjs/core/services/app'
import path from 'node:path'
import fs from 'node:fs'

export default class ChatsController {
  /**
   * Display a list of resource
   */
  async index({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const roomId = request.qs().room

    if (!roomId) {
      return response.status(400).json({
        message: 'room_id is required in query string (?room=)',
      })
    }

    const chat = await Chat.query()
      .where('room_id', roomId)
      .where('sender', user.id)
      .preload('sender_user')
      .preload('receiver_user')

    return response.status(200).json({
      chat: chat,
    })
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const validateData = await request.validateUsing(chatValidate, {
        messagesProvider,
      })

      const image = validateData?.image
      const uploadPath = app.makePath(`public/chat/${request.id()}`)
      await fs.promises.mkdir(uploadPath, { recursive: true }).catch(() => {})
      await image?.move(uploadPath)

      await Chat.create({
        sender: user.id,
        image: image ? `chat/${request.id()}/${image.fileName}` : undefined,
        message: validateData.message,
        receiver: validateData.receiver,
        room_id: validateData.room_id,
      })

      return response.status(200).json({
        message: 'Send chat success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Send chat failed',
        errors: error,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    const chat = await Chat.findOrFail(params.id)
    return response.status(200).json({
      chat: chat,
    })
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const chat = await Chat.findOrFail(params.id)
      const validateData = await request.validateUsing(chatValidate, {
        messagesProvider,
      })

      chat.merge({
        message: validateData.message,
      })

      await chat.save()
      return response.status(200).json({
        message: 'Update chat success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Update chat failed',
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const chat = await Chat.findOrFail(params.id)
      if (chat.image) {
        const imagePath = path.join(app.makePath('public/chat'), chat.id.toString(), chat.image)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      }

      await chat.delete()
      return response.status(200).json({
        message: 'Delete chat success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Delete chat failed',
        errors: error.messages,
      })
    }
  }
}
