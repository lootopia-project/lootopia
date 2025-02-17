import { useEffect, useState } from "react";
import { View, Text, Switch, Image, TouchableOpacity, TextInput } from "react-native";
import Return from "@/type/request/return";
import { doubleAuthEnable, toggleDoubleAuth,validateTwoFactorCode } from "@/services/DoubleAuth";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { useErrors } from '@/hooks/providers/ErrorProvider'
import AsyncStorage from "@react-native-async-storage/async-storage";
const MFA = () => {
    const { i18n } = useLanguage();
    
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [otpCode, setOtpCode] = useState<string>(""); // Champ pour entrer le code 2FA
    const { setErrorMessage, setErrorVisible } = useErrors();
    const [validationMessage, setValidationMessage] = useState<string | null>(null);
    const [email , setEmail] = useState<string >("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const email =await AsyncStorage.getItem("email")
                setEmail(email)
                const response: Return = await doubleAuthEnable();
                setIsTwoFactorEnabled(response.message); 
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchData().catch((error) => console.error("Erreur lors de l'exécution de fetchData :", error));
    }, []);

    const toggleTwoFactorAuth = async (value: boolean) => {
        console.log(value)
        if (value === !isTwoFactorEnabled){
            setIsTwoFactorEnabled(false);
        }
        try {
            console.log("bvalue "+value)
            const response: { svg: string, url: string } = await toggleDoubleAuth(value);

            if (value) {
                setQrCode(response.code.svg);  
            } else {
                setQrCode(null); 
            }

        } catch (error) {
            console.error("Erreur lors de la mise à jour du 2FA :", error);
        }
    };

    const validateCode = async () => {
        if (otpCode.length !== 6 || isNaN(Number(otpCode))) {
            setErrorMessage(i18n.t("Code must be 6 digits"));
            setErrorVisible(true);
            return;
        }

        try {
            const response: Return = await validateTwoFactorCode(otpCode,email);
            if (response.message) {
                setTimeout(async () => {
                    setIsTwoFactorEnabled(true);
                }, 3000); 
                setValidationMessage("✅ Authentification activée avec succès !");
            } else {
                setErrorMessage(i18n.t("Incorrect code. Please try again"));
                setErrorVisible(true);
            }
        } catch (error) {
            setErrorMessage("Error. Please try again");
            setErrorVisible(true);
        }
    };

    return (
        <View className="flex flex-col items-center justify-center p-6">
            <Text className="text-xl font-bold mb-4">{i18n.t('Multi-Factor Authentication')}</Text>
            <View className="flex flex-row items-center space-x-4 mb-4">
                <Text className="text-lg">{isTwoFactorEnabled ? "2FA Activé" : "2FA Désactivé"}</Text>
                <Switch
                    value={isTwoFactorEnabled}
                    onValueChange={(newValue) => toggleTwoFactorAuth(newValue)}
                />
            </View>

            {qrCode && !isTwoFactorEnabled&& (
                <View className="mt-4 items-center">
                    <Text className="text-lg mb-2">Scannez ce QR Code avec Google Authenticator :</Text>
                    <Image
                        style={{ width: 200, height: 200, resizeMode: "contain", marginTop: 10 }}
                        source={{ uri: qrCode }}
                    />

                    <TextInput
                        className="bg-gray-100 p-3 rounded-lg mt-4 text-center text-lg"
                        style={{ width: 150 }}
                        placeholder="Entrez le code 2FA"
                        keyboardType="numeric"
                        maxLength={6}
                        value={otpCode}
                        onChangeText={(text) => setOtpCode(text)}
                    />

                    <TouchableOpacity 
                        className="bg-blue-500 p-3 rounded-lg mt-4"
                        style={{ width: 150 }}
                        onPress={validateCode}
                    >
                        <Text className="text-white text-center">Valider</Text>
                    </TouchableOpacity>

                    {validationMessage && (
                        <Text className="mt-2 text-lg font-semibold text-center">
                            {validationMessage}
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
};

export default MFA;
