import CheckoutScreen from "@/components/stripe/checkout.native";
import { handlePayment } from '@/services/PaymentService';

export default function Checkout() {
  return <CheckoutScreen handlePaymentService={handlePayment} />;
}