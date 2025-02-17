import React, {useState} from 'react'
import {View} from 'react-native'
interface CheckMailProps {
    checkMailVisible: boolean;
}
const CheckMail : React.FC<CheckMailProps> = ({}) => {
    const  [checkMail, setCheckMail] = useState(true);
    
    return (
        <View className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <View className='bg-white p-6 rounded-lg shadow-lg'>
            <h1 className='text-xl font-bold mb-4'>Check your email</h1>
            <p>Please check your email for further instructions.</p>
            </View>
        </View>
    )
}

export default CheckMail