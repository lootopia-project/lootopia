interface PaymentRequestBody {
    paymentIntent: string;
    card: {
      number: string;
      exp_month: number;
      exp_year: number;
      cvc: string;
    };
  }
export default PaymentRequestBody;