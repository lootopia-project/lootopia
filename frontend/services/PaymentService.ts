import axios from 'axios';
import PaymentIntent from '@/type/feature/stripe/paymentIntent';
const API_URL = process.env.EXPO_PUBLIC_API_URL as string;
const config = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
};

const handlePayment = async () :Promise<PaymentIntent> => {
  try {
    const response = await axios.post(`${API_URL}/stripe/initPayment`, {amount:100}, config);
    return response.data;

    } catch (error) {
    console.error("Erreur de paiement :", error);
    throw new Error("Erreur de paiement");
  }
};



export { handlePayment };
