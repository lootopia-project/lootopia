import CheckoutScreen from "@/components/stripe/checkout/checkout.native";
import { handlePayment } from '@/services/PaymentService';

export default function Index() {
  return <CheckoutScreen handlePaymentService={handlePayment} />;
}