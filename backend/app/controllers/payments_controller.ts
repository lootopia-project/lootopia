import type { HttpContext } from '@adonisjs/core/http'
import PaymentService from '#services/payment_service'

export default class PaymentsController {
  async handleWebhook({ response }: HttpContext) {
    return response.ok({ received: true })
  }
  async initPayment({ response, auth }: HttpContext) {
    const amount = 1000 //amount in cents
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
}
