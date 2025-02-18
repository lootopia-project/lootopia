import {  useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useAuth } from "@/hooks/providers/AuthProvider";

const RecoveryCode = () => {
    const {checkRecoveryCode} = useAuth();
    const { i18n } = useLanguage();
    const router = useRouter();
    const { setErrorMessage, setErrorVisible } = useErrors();
    const [recoveryCode, setRecoveryCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleValidateRecoveryCode = async () => {
        const recoveryCodePattern = /^[a-f0-9]{10}-[a-f0-9]{10}$/;
        if (!recoveryCodePattern.test(recoveryCode)) {
            setErrorMessage(i18n.t("Invalid recovery code format. Expected format: xxxxxxxx-xxxxxxxxxx"));
            setErrorVisible(true);
            return;
        }

            setIsLoading(true);
        try {
            const response = await checkRecoveryCode(recoveryCode) 
            if (response.message) {
                setSuccessMessage(i18n.t("Recovery code validated successfully"));
                router.push("/"); 
            } else {
                setErrorMessage(i18n.t("Invalid recovery code. Please try again."));
                setErrorVisible(true);
            }
        } catch (error) {
            setErrorMessage(i18n.t("An error occurred. Please try again."));
            setErrorVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 items-center justify-center p-6 bg-gray-100">
            <Text className="text-2xl font-bold mb-6">{i18n.t("Enter Recovery Code")}</Text>
            <Text className="text-lg text-center text-gray-600 mb-4">
                {i18n.t("Enter your backup recovery code below to authenticate")}
            </Text>

            <TextInput
                className="bg-white p-3 rounded-lg text-center text-xl border border-gray-300 w-64"
                placeholder="xxxxxx-xxxxxxxxxx"
                value={recoveryCode}
                onChangeText={setRecoveryCode}
                autoCapitalize="none"
            />

            <TouchableOpacity
                className={`bg-blue-500 p-4 rounded-lg mt-6 w-64 ${isLoading ? "opacity-50" : ""}`}
                onPress={handleValidateRecoveryCode}
                disabled={isLoading}
            >
                <Text className="text-white text-center text-lg">
                    {isLoading ? i18n.t("Validating") : i18n.t("Verify Code")}
                </Text>
            </TouchableOpacity>

            {successMessage && (
                <Text className="text-green-500 mt-3">{successMessage}</Text>
            )}
        </View>
    );
};

export default RecoveryCode;
