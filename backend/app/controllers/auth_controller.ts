import type { HttpContext } from '@adonisjs/core/http'
import { registerValidate, messagesProvider, loginValidate } from '#validators/post_validate'
import User from '#models/user'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    try {
      const validateData = await request.validateUsing(registerValidate, {
        messagesProvider,
      })

      await User.create({
        username: validateData.username,
        password: validateData.password,
        email: validateData.email,
        role_id: validateData.role_id,
      })

      return response.status(200).json({
        message: 'Register Success',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Invalid credentials',
        errors: error.messages,
      })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      await request.validateUsing(loginValidate, {
        messagesProvider,
      })

      const user = await User.verifyCredentials(email, password)
      if (!user) {
        return response.status(422).json({
          message: 'Invalid Credentials',
        })
      }

      const token = await User.accessTokens.create(user)
      return response.status(200).json({
        message: 'Login success',
        token: token,
        user: user,
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Invalid Credentials',
        errors: error.messages,
      })
    }
  }

  async logout({ response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)

      return response.status(200).json({
        message: 'Logout success',
      })
    } catch (error) {
      return response.status(401).json({
        message: 'Logout failed',
        errors: error.messages,
      })
    }
  }

  async me({ auth, response }: HttpContext) {
    const user = await auth.authenticate()

    await user.load('role')
    await user.load('product', (productQuery) => {
      productQuery.preload('transaction')
      productQuery.preload('comment')
    })
    await user.load('transaction')
    await user.load('comment')

    const transactionTotal = user.product.reduce((sum, product) => {
      const totalPerProduct = product.transaction.reduce((tSum, trx) => tSum + trx.total, 0)
      return sum + totalPerProduct
    }, 0)

    const transactionCount = user.product.reduce((count, product) => {
      return count + product.transaction.length
    }, 0)

    const reviewCount = user.product.reduce((count, product) => {
      return count + product.comment.length
    }, 0)

    const monthlySales: Record<string, number> = {}

    user.product.forEach((product) => {
      product.transaction.forEach((trx: any) => {
        if (trx.status === 'canceled') return

        const date = new Date(trx.createdAt)
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`

        if (!monthlySales[monthYear]) {
          monthlySales[monthYear] = 0
        }

        monthlySales[monthYear] += trx.total
      })
    })

    const chartData = Object.keys(monthlySales).map((month) => ({
      month,
      monthTotal: monthlySales[month],
    }))

    return response.status(200).json({
      user: user,
      productCount: user.product.length,
      commentCount: user.comment.length,
      reviewCount: reviewCount,
      transactionTotal: transactionTotal,
      transactionCount: transactionCount,
      monthlySales: chartData,
    })
  }
}
