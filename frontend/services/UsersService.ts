import axios from "axios/index";
import AXIOS_ERROR from "@/type/request/axios_error";
import InfoEditUser from "@/type/feature/user/InfoEditUser";
import Return from "@/type/request/return";
import {getConfig} from "@/services/csrfService";

const API_URL=process.env.EXPO_PUBLIC_API_URL as string

const getInfoUser= async (): Promise<InfoEditUser> => {
    const config = await getConfig()
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
    const config = await getConfig()
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
    const config = await getConfig()
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
    const config = await getConfig()
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
    const config = await getConfig()
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


export { getInfoUser, updateInfoUser, updatePassword, CheckMail, CheckMailToken }
