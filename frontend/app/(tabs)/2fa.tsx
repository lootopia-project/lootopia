import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/providers/AuthProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { useErrors } from "@/hooks/providers/ErrorProvider";

const MFA = () => {
    const { checkDoubleAuth } = useAuth();
    const { i18n } = useLanguage();
    const router = useRouter();
    
    const [otpCode, setOtpCode] = useState<string>("");
    const [email, setEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setErrorMessage, setErrorVisible } = useErrors();

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem("email");
                setEmail(storedEmail || "");
            } catch (error) {
                setErrorMessage(i18n.t("An error occurred"));
                setErrorVisible(true);  
            }
        };
        fetchEmail();
    }, []);

    const handleValidateCode = async () => {
        if (otpCode.length !== 6 || isNaN(Number(otpCode))) {
            setErrorMessage(i18n.t("Code must be 6 digits"));
            setErrorVisible(true);
            return;
        }

        setIsLoading(true);
        try {
            const response = await checkDoubleAuth(otpCode);
            if (response.message) {
                router.push("/");  
            } else {
                setErrorMessage(i18n.t("Invalid code. Please try again."));
                setErrorVisible(true);
            }
        } catch (error) {
            setErrorVisible(true);
            setErrorMessage(i18n.t("An error occurred"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 items-center justify-center p-6 bg-gray-100">
            <Text className="text-2xl font-bold mb-6">{i18n.t("Two-Factor Authentication")}</Text>
            <Text className="text-lg text-center text-gray-600 mb-4">
                {i18n.t("Enter the 6-digit code from your authenticator app")}
            </Text>

            {email && <Text className="text-center text-gray-500 mb-2">{i18n.t("For account")}: {email}</Text>}

            <TextInput
                className="bg-white p-3 rounded-lg text-center text-xl border border-gray-300 w-64"
                placeholder="123456"
                keyboardType="numeric"
                maxLength={6}
                value={otpCode}
                onChangeText={setOtpCode}
            />

            <TouchableOpacity
                className={`bg-blue-500 p-4 rounded-lg mt-6 w-64 ${isLoading ? "opacity-50" : ""}`}
                onPress={handleValidateCode}
                disabled={isLoading}
            >
                <Text className="text-white text-center text-lg">
                    {isLoading ? i18n.t("Validating") : i18n.t("Verify Code")}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="bg-gray-500 p-4 rounded-lg mt-4 w-64"
                onPress={() => router.push("/user/recoveryCode")}
            >
                <Text className="text-white text-center text-lg">
                    {i18n.t("Enter a Recovery Code")}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default MFA;
