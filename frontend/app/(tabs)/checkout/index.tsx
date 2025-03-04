import CheckoutScreen from "@/components/stripe/checkout.web";
import { handlePayment } from '@/services/PaymentService';
import { Text } from 'react-native';

export default function Checkout() {
  // return <CheckoutScreen handlePaymentService={handlePayment} />;
  return <Text>Checkout</Text>;
} 