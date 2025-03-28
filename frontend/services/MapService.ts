import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapParams from '@/type/feature/map/params';
const API_URL = process.env.EXPO_PUBLIC_API_URL as string;


const getSpot = async (id:number) :Promise<MapParams> => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `${token}` : '',
    },
    withCredentials: true
  };
  try {
    const response = await axios.post(`${API_URL}/getSpot`,{id:id}, config);
    return response.data;

    } catch (error) {
    throw new Error("Erreur lors de la récupération des spots");
  }
};

const pushSpot = async (spot: MapParams) :Promise<void> => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `${token}` : '',
    },
    withCredentials: true
  };
  try {
    await axios.post(`${API_URL}/pushSpot`,spot, config);
  } catch (error) {
    throw new Error("Erreur lors de la création du spot");
  }
};

export { getSpot, pushSpot };
