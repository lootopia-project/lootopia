import CheckoutScreen from "@/components/stripe/checkout.native";
import { handlePaymentCrowns } from "@/services/PaymentService";

export default function Checkout() {
  return <CheckoutScreen handlePaymentService={handlePaymentCrowns} />;
}