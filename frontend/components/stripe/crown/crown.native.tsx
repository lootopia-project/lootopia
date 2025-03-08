import CheckoutScreen from "@/components/stripe/checkout/checkout.native";
import {  handlePaymentCrowns } from '@/services/PaymentService';

export default function Checkout() {
  return <CheckoutScreen handlePaymentService={handlePaymentCrowns} />;
}