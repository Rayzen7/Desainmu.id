import type { HttpContext } from '@adonisjs/core/http'
import { productValidate, messagesProvider } from '#validators/post_validate'
import Product from '#models/product'
import app from '@adonisjs/core/services/app'
import path from 'node:path'
import fs from 'node:fs'

export default class ProductsController {
  async index({ request, response }: HttpContext) {
    const categoryName = request.input('category')
    const productName = request.input('name')
    const page = request.input('page', 1)
    const limit = 12

    const products = await Product.query()
      .preload('user')
      .preload('category')
      .preload('transaction')
      .preload('comment')
      .withCount('transaction')
      .withCount('comment')
      .if(categoryName, (query) => {
        query.whereHas('category', (catQuery) => {
          catQuery.whereILike('name', `%${categoryName}%`)
        })
      })
      .if(productName, (query) => {
        query.whereILike('name', `%${productName}%`)
      })
      .paginate(page, limit)

    const serialized = products.toJSON()

    serialized.data = serialized.data.map((product) => {
      return {
        id: product.id,
        name: product.name,
        image: product.image,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        user: product.user,
        category: product.category,
        transaction: product.transaction,
        comment: product.comment,
        transactionCount: product.$extras?.transaction_count ?? 0,
        commentCount: product.$extras?.comment_count ?? 0,
      }
    })

    return response.status(200).json({
      products: serialized,
    })
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const validateData = await request.validateUsing(productValidate, {
        messagesProvider,
      })

      const image = validateData.image
      const uploadPath = app.makePath('public/product')
      await image?.move(uploadPath)

      await Product.create({
        name: validateData.name,
        image: `product/${image.fileName}`,
        description: validateData.description,
        quantity: validateData.quantity,
        price: validateData.price,
        category_id: validateData.category_id,
        created_by: user.id,
      })

      return response.status(200).json({
        message: 'Create product success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Create product failed',
        errors: error.messages,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.load('user')
    await product.load('category')
    await product.load('comment')
    await product.load('transaction')
    await product.loadCount('transaction')
    await product.loadCount('comment')

    return response.status(200).json({
      product: {
        ...product.toJSON(),
        transactionCount: product.$extras.transaction_count,
        commentCount: product.$extras.comment_count,
      },
    })
  }

  async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const product = await Product.findOrFail(params.id)
      const validateData = await request.validateUsing(productValidate, {
        messagesProvider,
      })

      if (product.image) {
        const imagePath = path.join(app.makePath('public/'), product.image)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      }

      const image = validateData.image
      const uploadPath = app.makePath('public/product')
      await image?.move(uploadPath)

      product.merge({
        name: validateData.name,
        image: `product/${image.fileName}`,
        description: validateData.description,
        quantity: validateData.quantity,
        price: validateData.price,
        created_by: user.id,
        category_id: validateData.category_id,
      })

      await product.save()
      return response.status(200).json({
        message: 'Update product success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Update product failed',
        errors: error.messages,
      })
    }
  }

  async updateQuantity({ params, request, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      product.merge({
        quantity: request.input('quantity'),
      })

      await product.save()
      return response.status(200).json({
        message: 'Update product quantity success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Update product failed',
        errors: error.messages,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      if (product.image) {
        const imagePath = path.join(app.makePath('public/'), product.image)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      }

      await product.delete()
      return response.status(200).json({
        message: 'Delete product success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Delete product failed',
        errors: error.messages,
      })
    }
  }
}
