import { useSearchParams } from 'expo-router/build/hooks';
import { useEffect,useState } from 'react';
import { View, Text } from 'react-native'

const CheckMail = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [checkToken, setCheckToken] = useState(token);
    useEffect(() => {
        console.log(token)
    }, [token])
    
    return (
        <View>
            <Text>CheckMail {token}</Text>
        </View>
    )
}

export default CheckMail