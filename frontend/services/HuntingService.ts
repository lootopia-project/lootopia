import Hunting from "@/type/feature/hunting/Hunting";
import axios from "axios";
import AXIOS_ERROR from "@/type/request/axios_error";
import LastMessageHunting from "@/type/feature/message/LastMessageHunting";
import {getConfig} from "@/services/csrfService";

const API_URL = process.env.EXPO_PUBLIC_API_URL as string

export const getAllHuntings = async (): Promise<Hunting[]> => {
    const config = await getConfig()
    try {
        const response = await axios.get<{
            message: string;
            success: boolean;
            huntings: Hunting[];
        }>(`${API_URL}/huntings/getAllHuntings`, config);

        return response.data.huntings;
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting");
        } else {
            throw new Error("Error connecting to server");
        }
    }
};


export const getPublicHuntings = async (): Promise<Hunting[]> => {
    const config = await getConfig()
    try {
        const response = await axios.get<{
            message: string;
            success: boolean;
            huntings: Hunting[];
        }>(`${API_URL}/huntings/getPublicHuntings`, config);

        return response.data.huntings;
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting");
        } else {
            throw new Error("Error connecting to server");
        }
    }
};

export const getHunting = async (id: number): Promise<Hunting> => {
    const config = await getConfig()

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
    const config = await getConfig()

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
