import { useEffect, useState } from "react";
import { View, Text, Switch, Image, TouchableOpacity, TextInput, Modal, ScrollView } from "react-native";
import Return from "@/type/request/return";
import { doubleAuthEnable, toggleDoubleAuth, validateTwoFactorCode, RecoveryCode } from "@/services/DoubleAuth";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { useErrors } from "@/hooks/providers/ErrorProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MFA = () => {
    const { i18n } = useLanguage();
    const { setErrorMessage, setErrorVisible } = useErrors();

    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [otpCode, setOtpCode] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([""]);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem("email");
                if (storedEmail) setEmail(storedEmail);

                const response: Return = await doubleAuthEnable();
                setIsTwoFactorEnabled(response.message);
            } catch (error) {
                setErrorMessage(i18n.t("Error. Please try again"));
                setErrorVisible(true);            }
        };
        fetchData()
    }, [i18n, setErrorMessage, setErrorVisible]);

    const toggleTwoFactorAuth = async (value: boolean) => {
        if (value === !isTwoFactorEnabled) setIsTwoFactorEnabled(false);
        try {
            const response: { svg: string, url: string } = await toggleDoubleAuth(value);
            if (value) {
                setQrCode(response.code.svg);
            } else {
                setQrCode(null);
            }
        } catch (error) {
            setErrorMessage(i18n.t("Error. Please try again"));
            setErrorVisible(true);       
         }
    };

    const validateCode = async () => {
        if (otpCode.length !== 6 || isNaN(Number(otpCode))) {
            setErrorMessage(i18n.t("Code must be 6 digits"));
            setErrorVisible(true);
            return;
        }

        try {
            const response: Return = await validateTwoFactorCode(otpCode, email);
            if (response.message) {
                setTimeout(() => setIsTwoFactorEnabled(true), 3000);
                setValidationMessage(i18n.t("Authentification successfull"));
            } else {
                setErrorMessage(i18n.t("Incorrect code. Please try again"));
                setErrorVisible(true);
            }
        } catch (error) {
            setErrorMessage(i18n.t("Error. Please try again"));
            setErrorVisible(true);
        }
    };

    const fetchRecoveryCodes = async () => {
        try {
            const response:string[] = await RecoveryCode(); 
            let parsedCodes = response;
                if (typeof response === "string") {
                try {
                    parsedCodes = JSON.parse(
                        response.replace(/{/g, "[").replace(/}/g, "]").replace(/;/g, ",")
                         );
                } catch (error) {
                    console.error("❌ Erreur lors du parsing JSON des recovery codes :", error);
                    setErrorMessage(i18n.t("Invalid recovery codes format"));
                    setErrorVisible(true);
                    return;
                }
            }
            setRecoveryCodes(parsedCodes);
            setModalVisible(true);
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des codes de secours :", error);
            setErrorMessage(i18n.t("Failed to fetch recovery codes"));
            setErrorVisible(true);
        }
    };
    
    
    

    return (
        <View className="flex flex-col items-center justify-center p-6">
            <Text className="text-xl font-bold mb-4">{i18n.t('Multi-Factor Authentication')}</Text>
            <View className="flex flex-row items-center space-x-4 mb-4">
                <Text className="text-lg">{isTwoFactorEnabled ? "2FA Activé" : "2FA Désactivé"}</Text>
                <Switch value={isTwoFactorEnabled} onValueChange={(newValue) => toggleTwoFactorAuth(newValue)} />
            </View>

            {qrCode && !isTwoFactorEnabled && (
                <View className="mt-4 items-center">
                    <Text className="text-lg mb-2">{i18n.t("Scan this QR Code with an authentication application")} :</Text>
                    <Image style={{ width: 200, height: 200, resizeMode: "contain", marginTop: 10 }} source={{ uri: qrCode }} />

                    <TextInput
                        className="bg-gray-100 p-3 rounded-lg mt-4 text-center text-lg"
                        style={{ width: 150 }}
                        placeholder="Entrez le code 2FA"
                        keyboardType="numeric"
                        maxLength={6}
                        value={otpCode}
                        onChangeText={(text) => setOtpCode(text)}
                    />

                    <TouchableOpacity className="bg-blue-500 p-3 rounded-lg mt-4" style={{ width: 150 }} onPress={validateCode}>
                        <Text className="text-white text-center">{i18n.t("Validate")}</Text>
                    </TouchableOpacity>

                    {validationMessage && <Text className="mt-2 text-lg font-semibold text-center">{validationMessage}</Text>}
                </View>
            )}

            {isTwoFactorEnabled && (
                <TouchableOpacity className="bg-gray-600 p-3 rounded-lg mt-6" style={{ width: 200 }} onPress={fetchRecoveryCodes}>
                    <Text className="text-white text-center">{i18n.t("Display emergency codes")}</Text>
                </TouchableOpacity>
            )}

            <Modal visible={isModalVisible} transparent={true} animationType="slide">
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white p-6 rounded-lg w-80">
                        <Text className="text-lg font-semibold mb-4">{i18n.t("Emergency codes")}</Text>
                        <ScrollView>
                            {recoveryCodes.length > 0 ? (
                                recoveryCodes.map((code, index) => (
                                    <Text key={index} className="text-center text-lg p-2 bg-gray-100 mb-2 rounded-lg">
                                        {code}
                                    </Text>
                                ))
                            ) : (
                                <Text className="text-center">{i18n.t("No code available")}</Text>
                            )}
                        </ScrollView>

                        <TouchableOpacity className="bg-red-500 p-3 rounded-lg mt-4" onPress={() => setModalVisible(false)}>
                            <Text className="text-white text-center">{i18n.t("Close")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal> 
        </View>
    );
};

export default MFA;
