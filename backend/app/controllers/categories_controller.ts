import Category from '#models/category'
import { categoriesValidate, messagesProvider } from '#validators/post_validate'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const categories = await Category.query().preload('product').withCount('product')

    const serializedCategories = categories.map((category) => {
      const serialized = category.serialize()
      return {
        ...serialized,
        productCount: category.$extras.product_count,
      }
    })

    return response.status(200).json({
      category: serializedCategories,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const validateData = await request.validateUsing(categoriesValidate, {
        messagesProvider,
      })

      await Category.create({
        name: validateData.name,
      })

      return response.status(200).json({
        message: 'Create category success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Create category failed',
        errors: error.messages,
      })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    return response.status(200).json({
      category: category,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      const validateData = await request.validateUsing(categoriesValidate, {
        messagesProvider,
      })

      category.merge({
        name: validateData.name,
      })

      await category.save()
      return response.status(200).json({
        message: 'Update category success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Update category failed',
        errors: error.messages,
      })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()

      return response.status(200).json({
        message: 'Delete category success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Delete category failed',
        errors: error.messages,
      })
    }
  }
}
