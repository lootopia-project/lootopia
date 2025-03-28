import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { getLogHistories } from "@/services/ShopService";
import LogHistory from "@/type/feature/shop/log_history";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, ScrollView } from "react-native";
import { format } from "date-fns";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { Link } from "expo-router";

const PurchaseHistory = () => {
    const { setErrorMessage, setErrorVisible } = useErrors();
    const { i18n } = useLanguage();
    const router = useRouter();
    const [logHistory, setLogHistory] = useState<LogHistory[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getLogHistories();
                setLogHistory(response);
            } catch (error) {
                setErrorMessage(i18n.t("An error occurred"));
                setErrorVisible(true);
            }
        };
        fetchHistory();
    }, [i18n, setErrorMessage, setErrorVisible]);

    return (
        <View className="flex-1 bg-gray-100 p-6" id="purchase-history">
            <Link href="/shop" asChild>
                <TouchableOpacity className="flex-row items-center mb-4">
                <ArrowLeftIcon size={24} color="black" />
                    <Text className="ml-2 text-lg font-semibold text-gray-700">
                    {i18n.t("Back to shop")}
                    </Text>
                </TouchableOpacity>
            </Link>
            <Text className="text-2xl font-bold mb-4">{i18n.t("Purchase History")}</Text>

            <ScrollView className="bg-white rounded-lg p-4 shadow-lg">
                {logHistory.length > 0 ? (
                    logHistory
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) 
                    .map((log) => (
                        <View
                            key={log.id}
                            className="flex-row justify-between items-center border-b py-3"
                        >
                            <Text className="text-md flex-1">{log.log}</Text>

                            <Text className="text-sm text-gray-500 ml-4">
                                {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm")}
                            </Text>
                            {log.orderId && (
                                <TouchableOpacity
                                    className="ml-4 bg-blue-500 px-3 py-2 rounded-lg"
                                    onPress={() => {
                                        router.push({
                                          pathname: "/shop/order-detail",
                                          params: { id: log.orderId },
                                        });
                                      }}
                                >
                                    <Text className="text-white font-bold">{i18n.t("View Details")}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))
                ) : (
                    <Text className="text-center text-gray-500">{i18n.t("No purchase history available")}</Text>
                )}
            </ScrollView>
        </View>
    );
};

export default PurchaseHistory;
