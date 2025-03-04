import CheckoutScreen from "@/components/stripe/checkout.web";
import { handlePayment } from '@/services/PaymentService';

export default function Checkout() {
  return <CheckoutScreen handlePaymentService={handlePayment} />;
}