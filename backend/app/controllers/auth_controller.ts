import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

export default class AuthController {

  async login({ request, auth, response }: HttpContext) {
    const { email, password } = request.all()

    const verifyCredentials = await User.verifyCredentials(email, password)
    console.log(verifyCredentials);

    if (verifyCredentials) {
      const head = await auth
      .use('api')
      .authenticateAsClient(verifyCredentials, [], { expiresIn: '1day' })
      return response.json(head)
    }
  }
  async register({ request, auth, response }: HttpContext) {
    const { email, password } = request.all()

    const USER_VERIFY = await User.findBy('email', email)
    if (USER_VERIFY) {
      return response.status(401).json({ message: 'User already exists' })
    }
    const newUser = await User.create({
      email: email,
      password: password
    })

    return response.json(newUser)
  }

  async logout({auth, response}: HttpContext) {
    const user = auth.use('api').user
    if (user) {
      db.from('auth_access_tokens').where('tokenable_id', user.id).delete().exec()
      return response.status(200).json({ message: true })
    }
    return response.status(401).json({ message: 'Unauthorized' })
  }

}
