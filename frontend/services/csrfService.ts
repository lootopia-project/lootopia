import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
const API_URL=process.env.EXPO_PUBLIC_API_URL as string

const getCsrfToken = async () => {
    try {
        const csrfToken = await AsyncStorage.getItem('csrf_token');        
        if (csrfToken && csrfToken !== 'undefined') {
            
            return csrfToken;
        } else {            
            const response = await axios.post( `${API_URL}/csrf-token`,{}, {
                headers: {
                    'Accept': 'application/json',
                },
                withCredentials: true,
            });
            
            const token = response.data.csrfToken;            
            await AsyncStorage.setItem('csrf_token', token);
            return token;
        }
    } catch (error) {
        console.error('Error retrieving CSRF token:', error);
        throw error;
    }
}
const getConfig = async () => {
    const token = await AsyncStorage.getItem('token');

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `${token}` : '',
            'x-csrf-token': await AsyncStorage.getItem('csrf_token'),
        },
        withCredentials: true
    }
    return config
}

export { getCsrfToken, getConfig };