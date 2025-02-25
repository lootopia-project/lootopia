import stripe from '@vbusatta/adonis-stripe/services/main'
import PaymentRequestBody from '#type/payment_request'

export default class PaymentService {
  async createPaymentIntent(amout: number) {
    const customer = await stripe.api.customers.create()
    const ephemeralKey = await stripe
      .api
      .ephemeralKeys
      .create(
        {customer: customer.id}, 
        {apiVersion: '2024-11-20.acacia'}
      )
      const paymentIntent = await stripe.api.paymentIntents.create({
        amount: amout,
        currency: 'eur',
        customer: customer.id,
      })
    return {paymentIntent, ephemeralKey}
    
  }
  
}