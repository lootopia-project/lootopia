import { useSearchParams } from 'expo-router/build/hooks';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native'
import { CheckMailToken } from '@/services/UsersService';
import { useErrors } from '@/hooks/providers/ErrorProvider';
import { useLanguage } from '@/hooks/providers/LanguageProvider';
const CheckMail = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [checkToken, setCheckToken] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const { setErrorVisible, setErrorMessage } = useErrors();
    const { i18n } = useLanguage();
    useEffect(() => {
        try {
            CheckMailToken(token).then(
                (response) => {
                    setCheckToken(response.success)
                    setResponseMessage(response.message)
                }
            )
        } catch (error) {
            setErrorMessage(i18n.t('An error occurred while fetching data'))
            setErrorVisible(true)
        }
    }, [token])

    return (
        <View className='d-flex justify-center items-center'>
            {
                checkToken
                    ?
                    <Text className='text-green-500'>{responseMessage}</Text>
                    :
                    <Text className='text-red-500'>{i18n.t('User or token not found')}</Text>
            }
        </View>
    )
}

export default CheckMail