import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn, role: number) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const user = await auth.authenticate()
    if (user.role_id !== role) {
      return response.status(403).json({
        message: 'Forbidden',
      })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
