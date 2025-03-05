import Item from "@/type/feature/shop/item";
import LogHistory from "@/type/feature/shop/log_history";
import OrderDetail from "@/type/feature/shop/order_detail";
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

export const getListItem = async (): Promise<Item[]> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }

    try {
        const response = await axios.get(`${API_URL}/shop/getListItem`, config)
        return response.data as Item[]
    } catch (err) {
        throw new Error("Error connecting to server")
    }
}

export const buyItem = async (ListItem:Item[]): Promise<void> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }
    try {
       const response= await axios.post(`${API_URL}/shop/buyItem`, {ListItem}, config)
         return response.data
    } catch (err) {
        throw new Error("Error connecting to server")
    }
}

export const getLogHistories = async (): Promise<LogHistory[]> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }

    try {
        const response = await axios.get(`${API_URL}/shop/getLogHistories`, config)
        return response.data as LogHistory[]
    } catch (err) {
        throw new Error("Error connecting to server")
    }
}

export const getOrderDetail = async (orderId: number): Promise<OrderDetail> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }

    try {
        const response = await axios.get(`${API_URL}/shop/getOrderDetailWithId/${orderId}`, config);
        return response.data as OrderDetail
    } catch (err) {
        throw new Error("Error connecting to server")
    }
}