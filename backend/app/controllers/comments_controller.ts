import type { HttpContext } from '@adonisjs/core/http'
import { commentValidate, messagesProvider } from '#validators/post_validate'
import Comment from '#models/comment'

export default class CommentsController {
  async index({ request, response }: HttpContext) {
    const { product } = request.qs()
    const query = Comment.query().preload('user').preload('product')

    if (product) {
      query.where('product_id', product)
    }

    const comment = await query
    return response.status(200).json({
      comment,
      commentCount: comment.length,
    })
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const validateData = await request.validateUsing(commentValidate, {
        messagesProvider,
      })

      await Comment.create({
        user_id: user.id,
        message: validateData.message,
        product_id: validateData.product_id,
      })

      return response.status(200).json({
        message: 'Comment sent success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Comment sent failed',
        errors: error.messages,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    const comment = await Comment.findOrFail(params.id)
    comment.load('product')
    comment.load('user')

    return response.status(200).json({
      comment: comment,
    })
  }

  async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const comment = await Comment.findOrFail(params.id)
      const validateData = await request.validateUsing(commentValidate, {
        messagesProvider,
      })

      comment.merge({
        user_id: user.id,
        message: validateData.message,
        product_id: validateData.product_id,
      })

      return response.status(200).json({
        message: 'Update comment success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Update comment failed',
        errors: error.messages,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const comment = await Comment.findOrFail(params.id)
      await comment.delete()

      return response.status(200).json({
        message: 'Delete comment success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Delete comment failed',
        errors: error.messages,
      })
    }
  }
}
