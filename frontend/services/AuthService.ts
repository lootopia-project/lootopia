import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import AXIOS_ERROR from '@/type/request/axios_error';
import LOGIN from '@/type/feature/auth/login';
import RETURN from '@/type/request/return';
// const API_URL = "http://localhost:3333"
const API_URL ='http://192.168.1.19:3333'

const FCM_PUBLIC_KEY = "BP-o-H2NKTa-Ske6pWy7Cl4CSvxRyrmJwwEaH4T_y7obZ-q2qmHPNQ8PQqSGh69QplFT7FIEYQ6JxjMjO3kYoK8"
import { requestFcmToken} from "./firebase"; // Chemin vers votre fichier Firebase

const config = {
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
}


export const loginUser = async (userData: LOGIN): Promise<RETURN> => {
    try {
        const { email, password } = userData;
        // Récupérer le token FCM via requestFcmToken
        const fcmToken = await requestFcmToken();
        if (!fcmToken) {
            console.warn("Token FCM introuvable ou non autorisé. Tentative de demande de permission...");

            // Demander l'autorisation manuellement
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                console.log("Autorisation accordée. Récupération d'un nouveau token FCM...");
                const newFcmToken = await requestFcmToken(); // Récupérer un nouveau token après autorisation
                if (!newFcmToken) {
                    console.warn("Impossible d'obtenir un token FCM après avoir demandé l'autorisation.");
                } else {
                    console.log("Nouveau token FCM obtenu :", newFcmToken);
                }
            } else {
                console.error("L'utilisateur a refusé les notifications.");
            }
        }

        console.log("fcmToken:", fcmToken);
        console.log(API_URL)
        const response = await axios.post<RETURN>(
            `${API_URL}/login`,
            {
                email,
                password,
                fcmToken: fcmToken || null,
            },
            config
        );

        return response.data;
    } catch (err: unknown) {
        console.error("Erreur lors de la connexion :", err);

        if (axios.isAxiosError(err) && err.message) {
            throw new Error("Erreur de connexion.");
        } else {
            throw new Error("Erreur de connexion au serveur.");
        }
    }
};


const logoutUser = async () : Promise<RETURN> =>{
    try {
      const tokenLogout = await AsyncStorage.getItem('token');
      const configLogout = {
          headers: {
              "Content-Type": "application/json",
              "Authorization": tokenLogout ? `${tokenLogout}` : '',
          },
          withCredentials: true
      }
        const response = await axios.post<RETURN>(`${API_URL}/logout`, {}, configLogout)
        return response.data
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting")
        } else {
            throw new Error("Error connecting to server")
        }
    }
}

const checkIsLogin = async () : Promise<RETURN> =>{
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
        },
        withCredentials: true
    }
      const response = await axios.post<RETURN>(`${API_URL}/checkIsLogin`, {}, config)

      return response.data
  } catch (err: unknown) {
      if ((err as AXIOS_ERROR).message) {
          AsyncStorage.removeItem('token')
          throw new Error("Error connecting")
      } else {
          throw new Error("Error connecting to server")
      }
  }
}

const registerUser = async (userData: LOGIN): Promise<RETURN> => {
  try {
    const { email, password } = userData;
    const response = await axios.post<RETURN>(
      `${API_URL}/register`,
      {
        email,
        password,
      },
      config
    );

    return response.data;
  } catch (err: unknown) {
    if ((err as AXIOS_ERROR).message) {
      throw new Error('Error connecting');
    } else {
      throw new Error('Error connecting to server');
    }
  }
};


export { loginUser, logoutUser , checkIsLogin, registerUser };
