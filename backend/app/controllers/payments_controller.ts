import type { HttpContext } from '@adonisjs/core/http'
import PaymentService from '#services/payment_service'
import Order from '#models/order'
import LogHistory from '#models/log_history'
import i18nManager from '@adonisjs/i18n/services/main'
export default class PaymentsController {
  async handleWebhook({ response }: HttpContext) {
    return response.ok({ received: true })
  }
  async initPayment({ response, auth }: HttpContext) {
    const order = await Order.query().where('status', 'pending').first()
    if (order === null) {
      return response.badRequest('No pending order found')
    }
    const amount = order.finalPrice
    const paymentService = new PaymentService()
    if (auth.user === undefined) {
      return response.unauthorized('You must be logged in to make a payment')
    }
    const paymentIntent = await paymentService.createPaymentIntent(amount, auth.user)
    return response.ok({
      paymentIntent: paymentIntent.paymentIntent.client_secret,
      ephemeralKey: paymentIntent.ephemeralKey.secret,
      customer: paymentIntent.paymentIntent.customer,
      publishableKey: process.env.STRIPE_API_KEY,
    })
  }

 
  async addCrowns({ response, auth, request }: HttpContext) {
    const amount = request.input('amount')
    const paymentService = new PaymentService()
    const user = auth.user
    if (!user) {
      return response.unauthorized('You must be logged in to make a payment')
    }
    const i18n = i18nManager.locale(user.lang)
    const paymentIntent = await paymentService.createPaymentIntent(amount, auth.user)
    const log =await LogHistory.create({
      userId: auth.user.id,
      log: i18n.t('_.You bought {{amount}} crowns', { amount }),
    })
    console.log(log)
    return response.ok({
      paymentIntent: paymentIntent.paymentIntent.client_secret,
      ephemeralKey: paymentIntent.ephemeralKey.secret,
      customer: paymentIntent.paymentIntent.customer,
      publishableKey: process.env.STRIPE_API_KEY,
    })
  }
}
