import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class TokenMiddleware {
  async handle({ response, auth }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */

    const user = await auth.check()
    if (!user) {
      return response.status(401).json({
        message: 'Unauthorized',
      })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
