import { useEffect, useState } from "react";
import { View, Text, Switch, Image, TouchableOpacity, TextInput } from "react-native";
import Return from "@/type/request/return";
import { doubleAuthEnable, toggleDoubleAuth,validateTwoFactorCode } from "@/services/DoubleAuth";
import { useLanguage } from "@/hooks/providers/LanguageProvider";

const MFA = () => {
    const { i18n } = useLanguage();
    
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [otpCode, setOtpCode] = useState<string>(""); // Champ pour entrer le code 2FA
    const [validationMessage, setValidationMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: Return = await doubleAuthEnable();
                console.log(response);
                setIsTwoFactorEnabled(response.message); 
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchData().catch((error) => console.error("Erreur lors de l'exécution de fetchData :", error));
    }, []);

    const toggleTwoFactorAuth = async (value: boolean) => {
        setIsTwoFactorEnabled(value);
        try {
            const response: { svg: string, url: string } = await toggleDoubleAuth(value);
            console.log(response);

            if (value) {
                setQrCode(response.code.svg);  // Stocke le QR code si 2FA activé
            } else {
                setQrCode(null); // Supprime le QR code si 2FA désactivé
            }

        } catch (error) {
            console.error("Erreur lors de la mise à jour du 2FA :", error);
        }
    };

    const validateCode = async () => {
        if (otpCode.length !== 6 || isNaN(Number(otpCode))) {
            setValidationMessage("Le code doit être un nombre de 6 chiffres.");
            return;
        }

        try {
            const response: Return = await validateTwoFactorCode(otpCode);
            if (response.message) {
                setValidationMessage("✅ Authentification activée avec succès !");
            } else {
                console.log(response);
                setValidationMessage("❌ Code incorrect, veuillez réessayer.");
            }
        } catch (error) {
            setValidationMessage("❌ Une erreur est survenue.");
            console.error("Erreur lors de la validation du code 2FA :", error);
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

            {isTwoFactorEnabled && qrCode && (
                <View className="mt-4 items-center">
                    <Text className="text-lg mb-2">Scannez ce QR Code avec Google Authenticator :</Text>
                    <Image
                        style={{ width: 200, height: 200, resizeMode: "contain", marginTop: 10 }}
                        source={{ uri: qrCode }}
                    />

                    {/* Champ de saisie du code 2FA */}
                    <TextInput
                        className="bg-gray-100 p-3 rounded-lg mt-4 text-center text-lg"
                        style={{ width: 150 }}
                        placeholder="Entrez le code 2FA"
                        keyboardType="numeric"
                        maxLength={6}
                        value={otpCode}
                        onChangeText={(text) => setOtpCode(text)}
                    />

                    {/* Bouton de validation */}
                    <TouchableOpacity 
                        className="bg-blue-500 p-3 rounded-lg mt-4"
                        style={{ width: 150 }}
                        onPress={validateCode}
                    >
                        <Text className="text-white text-center">Valider</Text>
                    </TouchableOpacity>

                    {/* Message de validation */}
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
