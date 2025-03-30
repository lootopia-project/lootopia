import ItemUsers from "@/type/feature/message/itemUsers";
import Item from "@/type/feature/shop/item";
import LogHistory from "@/type/feature/shop/log_history";
import OrderDetail from "@/type/feature/shop/order_detail";
import ShopCrown from "@/type/feature/shop/shop_crown"
import Return from "@/type/request/return";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import {getConfig} from "@/services/csrfService";

const API_URL=process.env.EXPO_PUBLIC_API_URL as string

const getShopCrown = async (): Promise<ShopCrown[]> => {
    const config = await getConfig()
    try {
        const response = await axios.get(`${API_URL}/shop/getShopCrowns`, config)
        return response.data as ShopCrown[]
    } catch (err) {
        throw new Error("Error connecting to server")
    }
}

const getListItem = async (): Promise<Item[]> => {
    const config = await getConfig()
    try {
        const response = await axios.get(`${API_URL}/shop/getListItem`, config)
        return response.data as Item[]
    } catch (err) {
        throw new Error("Error connecting to server")
    }
}

const buyItem = async (ListItem:Item[]): Promise<Return> => {
    const config = await getConfig()
    try {
       const response= await axios.post(`${API_URL}/shop/buyItem`, {ListItem}, config)
         return response.data
    } catch (err) {
        throw new Error("Error connecting to server")
    }
}

const getLogHistories = async (): Promise<LogHistory[]> => {
    const config = await getConfig()
    try {
        const response = await axios.get(`${API_URL}/shop/getLogHistories`, config)
        return response.data as LogHistory[]
    } catch (err) {
        throw new Error("Error connecting to server")
    }
}

const getOrderDetail = async (orderId: number): Promise<OrderDetail> => {
    const config = await getConfig()
    try {
        const response = await axios.get(`${API_URL}/shop/getOrderDetailWithId/${orderId}`, config);
        return response.data as OrderDetail
    } catch (err) {
        throw new Error("Error connecting to server")
    }
}

const getListItemUser = async (): Promise<Item[]> => {
    const config = await getConfig()
    const response = await axios.get(`${API_URL}/shop/getListItemUser`, config)
    return response.data as Item[]
}

const addItemToShop = async (item: Item): Promise<Return> => {
    const config = await getConfig()
    const response = await axios.post(`${API_URL}/shop/addItemToShop`, { item:item }, config)
    return response.data as Return
}

const getAllItem = async (): Promise<ItemUsers[]> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }
    const response = await axios.get(`${API_URL}/items/getAllItem`, config)
    return response.data as ItemUsers[]
}

export { getShopCrown, getListItem, buyItem, getLogHistories, getOrderDetail ,getListItemUser, addItemToShop,getAllItem}