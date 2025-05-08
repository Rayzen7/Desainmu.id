import type { HttpContext } from '@adonisjs/core/http'
import { messagesProvider, feedbackValidate } from '#validators/post_validate'
import Feedback from '#models/feedback'

export default class FeedbacksController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const feedback = await Feedback.all()
    return response.status(200).json({
      feedback: feedback,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const validateData = await request.validateUsing(feedbackValidate, {
        messagesProvider,
      })

      await Feedback.create({
        name: validateData.name,
        comment: validateData.comment,
      })

      return response.status(200).json({
        message: 'Feedback sent success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Feedback sent failed',
        errors: error.messages,
      })
    }
  }
}
