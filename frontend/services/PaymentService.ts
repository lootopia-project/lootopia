import axios from 'axios';
import PaymentIntent from '@/type/feature/stripe/paymentIntent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Return from '@/type/request/return';
const API_URL = process.env.EXPO_PUBLIC_API_URL as string;


const handlePayment = async () :Promise<PaymentIntent> => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `${token}` : '',
    },
    withCredentials: true
  };
  try {
    const response = await axios.post(`${API_URL}/stripe/initPayment`,{}, config);
    return response.data;

    } catch (error) {
    console.error("Erreur de paiement :", error);
    throw new Error("Erreur de paiement");
  }
};


const createOrder=async(amount:number)=>{
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `${token}` : '',
    },
    withCredentials: true
  };
  try {
    const response = await axios.post(`${API_URL}/stripe/order`,{amount}, config);
    return response.data as Return

    } catch (error) {
    console.error("Erreur de paiement :", error);
    throw new Error("Erreur de paiement");
  }
}



export { handlePayment,createOrder };
