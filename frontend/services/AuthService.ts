import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import AXIOS_ERROR from '@/type/request/axios_error';
import LOGIN from '@/type/feature/auth/login';
import RETURN from '@/type/request/return';
import { requestFcmToken} from "./firebase";
import UsersGoogle from "@/type/feature/auth/user_google";
import {getConfig} from "@/services/csrfService";
const API_URL=process.env.EXPO_PUBLIC_API_URL as string

const loginUser = async (userData: LOGIN): Promise<RETURN> => {
  const config = await getConfig()
  
    try {
        const { email, password } = userData;
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
      const config = await getConfig()

        const response = await axios.post<RETURN>(`${API_URL}/logout`, {}, config)
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
    const config = await getConfig()
    console.log("config",config);
    
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
  const config = await getConfig()

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


const LoginOrRegisterGoogle= async (users:UsersGoogle): Promise <RETURN> => {
  const config = await getConfig()

  try {
    const { email, firstName, lastName, img ,provider,mode} = users;
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
    const response = await axios.post<RETURN>(
      `${API_URL}/users/loginOrRegisterGoogle`,
      {
        email,
        firstName,
        lastName,
        img,
        provider,
        mode,
        fcmToken
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
}

const forgotPassword = async (email: string,locale:string): Promise<RETURN> => {
  const config = await getConfig()

  try {
    const response = await axios.post<RETURN>(
      `${API_URL}/forgot-password`,
      {
        email,
        locale
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
}

const resetPassword = async (token: string, password: string): Promise<RETURN> => {
  const config = await getConfig()

  try {
    const response = await axios.post<RETURN>(
      `${API_URL}/reset-password`,
      {
        token,
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
}


export { loginUser, logoutUser , checkIsLogin, registerUser, LoginOrRegisterGoogle,forgotPassword,resetPassword};
