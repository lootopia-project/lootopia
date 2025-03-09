import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios/index";
import AXIOS_ERROR from "@/type/request/axios_error";
import InfoEditUser from "@/type/feature/user/InfoEditUser";
import Return from "@/type/request/return";
import ItemUser from "@/type/feature/user/item_user";

const API_URL=process.env.EXPO_PUBLIC_API_URL as string

const getInfoUser= async (): Promise<InfoEditUser> => {
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

const updateInfoUser = async (infoEditUser: InfoEditUser): Promise<Return> => {
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

const updatePassword = async (currentPassword: string, newPassword: string): Promise<Return> => {
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

const CheckMail = async (): Promise<Return> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }
    try {
        const response=await axios.post(`${API_URL}/users/CheckMail`, {} ,config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
} 

const CheckMailToken = async (mailToken:string| null): Promise<Return> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }
    try {
        const response=await axios.post(`${API_URL}/users/CheckMailToken`, {mailToken:mailToken} ,config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
} 

const getUsersItem = async (): Promise<ItemUser[]> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }
    try {
        const response = await axios.get(`${API_URL}/users/getItemUser`, config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}

const putOnSale = async (id: number, price: number, quantity: number): Promise<Return> => {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }
    try {
        const response=await axios.post(`${API_URL}/item/putOnSale`, {id, price, quantity}, config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}
export { getInfoUser, updateInfoUser, updatePassword, CheckMail, CheckMailToken, getUsersItem, putOnSale }
