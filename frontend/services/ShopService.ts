import ShopCrown from "@/type/feature/shop/shop_crown"
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL=process.env.EXPO_PUBLIC_API_URL as string

export const getShopCrown = async (): Promise<ShopCrown[]> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }

    try {
        const response = await axios.get(`${API_URL}/shop/getShopCrowns`, config)
        return response.data as ShopCrown[]
    } catch (err) {
        throw new Error("Error connecting to server")
    }
}