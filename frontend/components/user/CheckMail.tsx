import React, { useState } from 'react'
import { View, Text, TouchableOpacity, GestureResponderEvent, Modal } from 'react-native'
import CheckMailProps from '@/type/feature/user/checkMailProps'
import { useLanguage } from '@/hooks/providers/LanguageProvider'
import { CheckMail as CheckMailMethod } from '@/services/UsersService'
import { useErrors } from '@/hooks/providers/ErrorProvider'
const CheckMail: React.FC<CheckMailProps> = ({ handleCheckMail }) => {
    const { i18n } = useLanguage();
    const { setErrorMessage, setErrorVisible } = useErrors();
    const submit = async () => {
        try {
            await CheckMailMethod()
        } catch (error) {
            setErrorMessage(i18n.t("An error occurred while fetching data"));
            setErrorVisible(true);
        }
    }
    return (
        <Modal id='truc' className="">
            <View className='flex-1 justify-center items-center'>
                <View className="bg-white p-6 rounded shadow-lg w-11/12 max-w-sm">
                    <TouchableOpacity onPress={handleCheckMail}>
                        <Text className="text-2xl font-bold">&times;</Text>
                    </TouchableOpacity>
                    <Text className="text-xl font-semibold mb-4 mt-4">{i18n.t("Check your email")}</Text>
                    <Text>{i18n.t("Please check your email")}</Text>
                    <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mb-4 mt-4 w-full" onPress={() => submit()}>
                        <Text className="text-white text-center">{i18n.t("Send")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default CheckMail