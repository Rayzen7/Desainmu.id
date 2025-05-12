import User from '#models/user'
import { messagesProvider, userUpdateValidate } from '#validators/post_validate'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import path from 'node:path'
import fs from 'node:fs'

export default class UsersController {
  async index({ response }: HttpContext) {
    const user = await User.query().preload('role')
    return response.status(200).json({
      user: user,
    })
  }

  async show({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.status(404).json({
        message: 'User not found',
      })
    }

    return response.status(200).json({
      user: user,
    })
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      const validateData = await request.validateUsing(userUpdateValidate, {
        messagesProvider,
      })

      const image = validateData?.image
      const uploadPath = app.makePath('public/user')
      await image?.move(uploadPath)

      user.merge({
        username: validateData.username,
        email: validateData.email,
        no_hp: validateData.no_hp,
        date_of_birth: validateData.date_of_birth,
        address: validateData.address,
        gender: validateData.gender,
        ...(image && { image: `user/${image.fileName}` }),
        role_id: validateData.role_id,
      })

      await user.save()
      return response.status(200).json({
        message: 'Update user success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Update user failed',
        errors: error.messages,
      })
    }
  }

  async updateStatus({ request, response, params }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      user.merge({
        role_id: request.input('role_id'),
      })

      await user.save()
      return response.status(200).json({
        message: 'Update user status success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Update user status failed',
        error: error,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      if (user.image) {
        const imagePath = path.join(app.makePath('public/'), user.image)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      }

      await user.delete()
      return response.status(200).json({
        message: 'Delete user success',
      })
    } catch (error) {
      return response.status(200).json({
        message: 'Delete user success',
        errors: error.messages,
      })
    }
  }
}
