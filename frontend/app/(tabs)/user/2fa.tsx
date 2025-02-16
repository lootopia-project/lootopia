import { useEffect, useState } from "react";
import { View, Text, Switch } from "react-native";
import Return from "@/type/request/return";
import {doubleAuthEnable, toggleDoubleAuth} from "@/services/DoubleAuth";

const MFA = () => {
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: Return = await doubleAuthEnable();
                console.log(response);
                setIsTwoFactorEnabled(response.message);  // Active 2FA si réponse positive

            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchData().catch((error) => console.error("Erreur lors de l'exécution de fetchData :", error));
    }, []);

    const toggleTwoFactorAuth = async (value:boolean) => {
        setIsTwoFactorEnabled(value);
        try {
            const response: QrCodeRequest = await toggleDoubleAuth(value);
            console.log(response.code);

            // }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du 2FA :", error);
        }
    };

    return (
        <View className="flex flex-col items-center justify-center p-6">
            <Text className="text-xl font-bold mb-4">Multi-Factor Authentication</Text>
            <View className="flex flex-row items-center space-x-4">
                <Text className="text-lg">{isTwoFactorEnabled ? "2FA Activé" : "2FA Désactivé"}</Text>
                <Switch
                    value={isTwoFactorEnabled}
                    onValueChange={(newValue) => toggleTwoFactorAuth(newValue)}
                />

            </View>
        </View>
    );
};

export default MFA;
