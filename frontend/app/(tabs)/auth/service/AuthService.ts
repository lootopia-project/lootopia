import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import AXIOS_ERROR from '@/type/request/axios_error';
import LOGIN from '@/type/feature/auth/login';
import RETURN from '@/type/request/return';
import { API_URL } from '@env'

const config = {
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
}
const loginUser = async (userData: LOGIN): Promise<RETURN> => {
    try {
      const { email, password } = userData;  
      const response = await axios.post<RETURN>(
        `${API_URL}/login`,
        {
          email,
          password,
        },
        config
      );
      const token = response.data.headers.authorization;      
      
      return response.data;
    } catch (err: unknown) {
      if ((err as AXIOS_ERROR).message) {
        throw new Error('Error connecting');
      } else {
        throw new Error('Error connecting to server');
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
    console.log(token);
    
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

export { loginUser, logoutUser , checkIsLogin};