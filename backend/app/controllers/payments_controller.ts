import type { HttpContext } from '@adonisjs/core/http'
import PaymentService from '#services/payment_service'

export default class PaymentsController {
  async handleWebhook({ response }: HttpContext) {
    return response.ok({ received: true })
  }
  async initPayment ({ response,request }: HttpContext) {    
    const { amount } = request.only(['amount'])
    const paymentService = new PaymentService()
    const paymentIntent = await paymentService.createPaymentIntent(amount)
    return response.ok({
      paymentIntent:paymentIntent.paymentIntent.client_secret,
      ephemeralKey:paymentIntent.ephemeralKey.secret,
      customer:paymentIntent.paymentIntent.customer,
      publishableKey:process.env.STRIPE_API_KEY
    })
  }
}