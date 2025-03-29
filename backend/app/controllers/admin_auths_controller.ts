import type { HttpContext } from '@adonisjs/core/http'
import Admin from '#models/admin'
export default class AdminAuthsController {
    public async login({ request, auth, response, view }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])
        const admin = await Admin.verifyCredentials(email, password)
        if (admin) {
          await auth.use('web').login(admin)
          
          return view.render('pages/index')
        }
        return response.redirect('/')
      }
    public async logout({ auth, response }: HttpContext) {
        await auth.use('web').logout()
        return response.redirect('/')
    }
}