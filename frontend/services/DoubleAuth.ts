import Return from "@/type/request/return";
import axios from "axios";
import AXIOS_ERROR from "@/type/request/axios_error";
import { requestFcmToken } from "./firebase";
import {getConfig} from "@/services/csrfService";
import QrCodeRequest from "@/type/feature/user/2fa/qr_code";
const API_URL=process.env.EXPO_PUBLIC_API_URL as string

export const doubleAuthEnable = async (): Promise<Return> => {
    const config = await getConfig()

    try {
        const response=await axios.get(`${API_URL}/users/isTwoFactorEnabled`, config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}

export const toggleDoubleAuth = async (isTwoFactorEnabled:boolean): Promise<QrCodeRequest> => {
    const config = await getConfig()

    try {
        const response=await axios.post(`${API_URL}/users/toggleDoubleAuth`, {isTwoFactorEnabled}, config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}

export const validateTwoFactorCode = async (otpCode:string,email:string): Promise<Return> => {
    const config = await getConfig()

    try {
        const response=await axios.post(`${API_URL}/users/validateTwoFactorCode`, {otpCode}, config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}

export const CheckDoubleAuth = async (otpCode:string,email:string): Promise<Return> => {
    const config = await getConfig()

    const fcmToken = await requestFcmToken();
    
    if (!fcmToken) {

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const newFcmToken = await requestFcmToken();
            if (!newFcmToken) {
                console.warn("Impossible d'obtenir un token FCM après avoir demandé l'autorisation.");
            }
        } else {
            console.error("L'utilisateur a refusé les notifications.");
        }
    }


    try {
        const response=await axios.post(`${API_URL}/users/checkDoubleAuth`, {otpCode,email,fcmToken}, config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}


export const CheckRecoveryCode = async (recoveryCode:string,email:string): Promise<Return> => {
    const config = await getConfig()
    const fcmToken = await requestFcmToken();
    
    if (!fcmToken) {

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const newFcmToken = await requestFcmToken();
            if (!newFcmToken) {
                console.warn("Impossible d'obtenir un token FCM après avoir demandé l'autorisation.");
            }
        } else {
            console.error("L'utilisateur a refusé les notifications.");
        }
    }

    try {
        const response=await axios.post(`${API_URL}/users/checkRecoveryCode`, {recoveryCode,email,fcmToken}, config)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}

export const RecoveryCode = async () => {
    const config = await getConfig()

    try {
        const response=await axios.get<string[]>(`${API_URL}/users/recoveryCode`, config)

        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}
