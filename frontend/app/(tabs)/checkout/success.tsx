import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ResultPayment from "@/type/feature/stripe/resultPayment";
import { Link, router } from "expo-router";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { useErrors } from "@/hooks/providers/ErrorProvider";

export default function Checkout() {
    const [infoPayment, setInfoPayment] = useState<ResultPayment | null>(null);
    const { i18n } = useLanguage();
    const { setErrorMessage, setErrorVisible } = useErrors();
    const formatAmount = (amount: number, currency: string) => {
        const montantFloat = amount / 100;
        return `${montantFloat.toFixed(2)} ${currency.toUpperCase()}`;
    };
    useEffect(() => {
        const getInfoPayment = async () => {
            try {
                const result = await AsyncStorage.getItem("result");
                if (result) {
                    const parsed = JSON.parse(result) as ResultPayment;
                    setInfoPayment(parsed);
                    await AsyncStorage.removeItem("result");
                    await AsyncStorage.removeItem("amount");
                } else {
                    setErrorMessage(i18n.t("No payment yet"));
                    setErrorVisible(true);
                    router.push("/")
                }
            } catch (error) {
                console.error("Erreur de récupération du PaymentIntent :", error);
            }
        };

        getInfoPayment();
    }, [i18n, setErrorMessage, setErrorVisible]);

    return (
        <View className="flex-1">
            {infoPayment ? (
                <>
                    <ScrollView className="flex-1 bg-white">
                        <View className="flex-1 items-center py-4">
                            <View className="w-full max-w-md bg-white rounded-md p-6">
                                <Text className="text-2xl font-bold text-green-600 mb-6">
                                    {i18n.t("Successful payment")} !
                                </Text>

                                <View className="bg-white rounded-md shadow-md border border-gray-200 p-6">
                                    <View className="mb-4">
                                        <Text className="font-semibold text-gray-600">
                                            {i18n.t("Email")} :
                                        </Text>
                                        <Text className="text-base text-gray-900">
                                            {infoPayment?.receipt_email}
                                        </Text>
                                    </View>

                                    <View className="mb-4">
                                        <Text className="font-semibold text-gray-600">
                                            {i18n.t("Payment status")} :
                                        </Text>
                                        <Text className="text-base text-gray-900">
                                            {infoPayment?.status}
                                        </Text>
                                    </View>

                                    <View className="mb-4">
                                        <Text className="font-semibold text-gray-600">
                                            {i18n.t("Amount paid")} :
                                        </Text>
                                        <Text className="text-base text-gray-900">
                                            {infoPayment ? formatAmount(infoPayment.amount, infoPayment.currency) : ""}
                                        </Text>
                                    </View>

                                    <Text className="mt-8 text-gray-700">
                                        {i18n.t("Thank you for your payment")}
                                    </Text>
                                    <TouchableOpacity className="mt-6 items-center px-4 py-2 bg-green-500 rounded shadow-md">
                                        <Link href={"/"} className="text-white font-semibold">
                                            {i18n.t("Back to home")}
                                        </Link>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </ScrollView>
                </>
            ) : (
                <Text>{i18n.t("No payment yet")}</Text>
            )}
        </View>
    );
}
