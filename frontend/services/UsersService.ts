import Hunting from "@/type/feature/auth/hunting";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios/index";
import AXIOS_ERROR from "@/type/request/axios_error";
import InfoEditUser from "@/type/feature/user/InfoEditUser";
import Return from "@/type/request/return";

const API_URL=process.env.EXPO_PUBLIC_API_URL as string

export const getInfoUser= async (): Promise<InfoEditUser> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }
    try {
        const response = await axios.get<InfoEditUser>(`${API_URL}/users/getInfoUser`, config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}

export const updateInfoUser = async (infoEditUser: InfoEditUser): Promise<Return> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }
    try {
        const response=await axios.post(`${API_URL}/users/updateInfoUser`, infoEditUser, config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}

export const updatePassword = async (currentPassword: string, newPassword: string): Promise<Return> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }
    try {
        const response=await axios.post(`${API_URL}/users/updatePassword`, {currentPassword, newPassword}, config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }

}
