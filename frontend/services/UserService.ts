import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import RETURN from "@/type/request/return";
import AXIOS_ERROR from "@/type/request/axios_error";
const API_URL = "http://localhost:3333"
// const API_URL ='http://192.168.1.19:3333'
export const UserConnected = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `${token}` : '',
            },
            withCredentials: true
        }
        const response = await axios.get<RETURN>(`${API_URL}/UserConnected`, config)

        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}
