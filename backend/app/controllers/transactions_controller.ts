import Transaction from '#models/transaction'
import type { HttpContext } from '@adonisjs/core/http'
import { transactionValidate, messagesProvider } from '#validators/post_validate'
import { v4 as uuidv4 } from 'uuid'
import MidtransService from '#services/midtran_service'
import Product from '#models/product'

export default class TransactionsController {
  async index({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const status = request.qs().status

    const transactionQuery = Transaction.query()
      .where('user_id', user.id)
      .preload('user')
      .preload('product', (productQuery) => {
        productQuery.preload('category')
      })

    if (status) {
      transactionQuery.where('status', status)
    }

    const transactions = await transactionQuery.exec()

    return response.status(200).json({
      transaction: transactions,
    })
  }

  async indexAdmin({ request, response, auth }: HttpContext) {
    const { sort = 'DESC', order = 'created_at' } = request.qs()
    const validSorts = ['ASC', 'DESC']
    const sortDirection = validSorts.includes(sort.toUpperCase()) ? sort.toUpperCase() : 'DESC'

    const allowedOrders = ['id', 'name', 'created_at', 'updated_at', 'total', 'status']
    const orderByColumn = allowedOrders.includes(order.toLowerCase())
      ? order.toLowerCase()
      : 'created_at'

    const user = await auth.authenticate()

    const product = await Product.query().where('created_by', user.id)
    const productIds = product.map((p) => p.id)

    const transaction = await Transaction.query()
      .whereIn('product_id', productIds)
      .orderBy(orderByColumn, sortDirection)
      .preload('user')
      .preload('product')

    return response.status(200).json({
      transaction: transaction,
    })
  }

  public async store({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()

      const validateData = await request.validateUsing(transactionValidate, {
        messagesProvider,
      })

      const orderId = `ORDER-${uuidv4()}`
      const grossAmount = validateData.total

      const midtrans = new MidtransService()
      const transaction = await midtrans.createTransaction(orderId, grossAmount, user.username)

      await Transaction.create({
        user_id: user.id,
        product_id: validateData.product_id,
        quantity: validateData.quantity,
        status: validateData.status,
        total: validateData.total,
      })

      return response.status(200).json({
        message: 'Transaction created',
        snapToken: transaction.token,
        redirectUrl: 'http://localhost:3000',
      })
    } catch (error) {
      console.error(error)
      return response.status(422).json({
        message: 'Transaction failed',
        errors: error.messages || error,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    const transaction = await Transaction.findOrFail(params.id)
    await transaction.load('user')
    await transaction.load('product', (productQuery) => {
      productQuery.preload('category')
    })

    return response.status(200).json({
      transaction: transaction,
    })
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const transaction = await Transaction.findOrFail(params.id)
      transaction.merge({
        status: request.input('status'),
        delivered_status_1: request.input('delivered_status_1'),
        delivered_status_2: request.input('delivered_status_2'),
        delivered_status_3: request.input('delivered_status_3'),
        delivered_status_4: request.input('delivered_status_4'),
      })

      await transaction.save()
      return response.status(200).json({
        message: 'Update transaction success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Update transaction failed',
        error: error,
      })
    }
  }
}
