import CheckoutScreen from "@/components/stripe/checkout.web";
import { handlePaymentCrowns } from "@/services/PaymentService";

export default function Checkout() {
  return <CheckoutScreen handlePaymentService={handlePaymentCrowns} />;
}