import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {Platform} from "react-native";


// Ajoute une valeur par défaut pour éviter les erreurs
let API_URL =''
if (Platform.OS === 'web') {
    API_URL=process.env.EXPO_PUBLIC_API_URL as string
}else{
    API_URL=process.env.EXPO_PUBLIC_API_URL_MOBILE as string
}


export const UserConnected = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `${token}` : '',
            },
            withCredentials: true
        };

        const response = await axios.get(`${API_URL}/UserConnected`, config);
        return response.data as User
    } catch (err: unknown) {
        console.error("Erreur Axios :", err);

        if ((err as any)?.message) {
            throw new Error("Error connecting");
        } else {
            throw new Error("Error connecting to server");
        }
    }
};
