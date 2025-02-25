import User from '#models/user'
import stripe from '@vbusatta/adonis-stripe/services/main'

export default class PaymentService {
  async createPaymentIntent(amout: number,user:User) {
    const customer = await stripe.api.customers.create({
      email: user.email,
      name: user.name,
      phone: user.phone,
    })
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
        receipt_email: user.email,
      })
    return {paymentIntent, ephemeralKey}
    
  }
  
}