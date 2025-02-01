import Hunting from "@/type/feature/auth/hunting";
import axios from "axios";
import AXIOS_ERROR from "@/type/request/axios_error";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_URL = "http://localhost:3333"
// const API_URL ='http://192.168.1.19:3333'
const token = await AsyncStorage.getItem('token');

const config = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `${token}` : '',
    },
    withCredentials: true
}
export const getHunting= async (id: number): Promise<Hunting> => {
    try {
        const response = await axios.get<Hunting>(`${API_URL}/hunting/${id}`, config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}
