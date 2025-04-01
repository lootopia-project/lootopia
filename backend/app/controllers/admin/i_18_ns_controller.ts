import type { HttpContext } from '@adonisjs/core/http'
export default class I18NsController {
    async index({ request, response }: HttpContext) {
        const locales = request.input('lang', 'en')
        response.cookie('lang', locales, {
            path: '/',
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 365,
          })
        return response.redirect('back')
    }
}