import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL as string
const EXPIRATION_MS = 2 * 60 * 60 * 1000

const getCsrfToken = async () => {
  try {
    const stored = await AsyncStorage.getItem('csrf_token')

    if (stored) {
      const parsed = JSON.parse(stored)

      const now = Date.now()
      if (parsed.token && parsed.expiresAt > now) {
        return parsed.token
      }
      await AsyncStorage.removeItem('csrf_token')
    }

    const response = await axios.post(`${API_URL}/csrf-token`, {}, {
      headers: {
        'Accept': 'application/json',
      },
      withCredentials: true,
    })

    const token = response.data.csrfToken
    const tokenData = {
      token,
      expiresAt: Date.now() + EXPIRATION_MS
    }
    console.log(response);
    

    await AsyncStorage.setItem('csrf_token', JSON.stringify(tokenData))
    return token

  } catch (error) {
    console.error('Error retrieving CSRF token:', error)
    throw error
  }
}

const getConfig = async () => {
  const token = await AsyncStorage.getItem('token')
  const csrf = await getCsrfToken()
  console.log(document.cookie);
  
  const xsrfToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('XSRF-TOKEN='))
  ?.split('=')[1]
  console.log('xsrfToken', xsrfToken);
  console.log(document.cookie
    .split('; '));
  
  return {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `${token}` : '',
      'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
      'X-CSRF-Token': csrf,
    },
    withCredentials: true,
  }
}

export { getCsrfToken, getConfig }
