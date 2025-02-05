import Hunting from "@/type/feature/auth/hunting";
import axios from "axios";
import AXIOS_ERROR from "@/type/request/axios_error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LastMessageHunting from "@/type/feature/message/LastMessageHunting";
const API_URL=process.env.EXPO_PUBLIC_API_URL as string



export const getHunting= async (id: number): Promise<Hunting> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }
    try {
        const response = await axios.get<Hunting>(`${API_URL}/huntings/${id}`, config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}

export const getHuntingsForMessages = async (): Promise<LastMessageHunting> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }
    try {
        const response = await axios.get<LastMessageHunting>(`${API_URL}/huntings/getAllForMessage`, config)
        return response.data as LastMessageHunting
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}
