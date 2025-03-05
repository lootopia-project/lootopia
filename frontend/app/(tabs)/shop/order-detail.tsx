import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { getOrderDetail } from "@/services/ShopService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import OrderDetailType from "@/type/feature/shop/order_detail";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const OrderDetail = () => {
    const { i18n } = useLanguage();
    const { setErrorMessage, setErrorVisible } = useErrors();
    const { id } = useLocalSearchParams();
    const [orderDetail, setOrderDetail] = useState<OrderDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await getOrderDetail(Number(id));
                setOrderDetail(response);
            } catch (error) {
                setErrorMessage(i18n.t("An error occurred"));
                setErrorVisible(true);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (!orderDetail) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-lg font-semibold text-red-500">
                    {i18n.t("Order not found")}
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-4 bg-gray-100">
             <TouchableOpacity className="flex-row items-center mb-4" onPress={() => router.push("/shop/purchase-history")}>
                <ArrowLeftIcon size={24} color="black" />
                <Text className="ml-2 text-lg font-semibold text-gray-700">
                    {i18n.t("Back")}
                </Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-800 mb-2">
                {i18n.t("Order")} #{orderDetail.id}
            </Text>
            <Text className="text-lg text-green-600 mb-4">
                {i18n.t("Status")}: {orderDetail.status}
            </Text>

            <FlatList
                data={orderDetail.ordersItem}
                keyExtractor={(item) => item.item.id.toString()}
                renderItem={({ item }) => (
                    <View className="flex-row items-center bg-white p-3 mb-2 rounded-lg shadow">
                        <Image source={{ uri: item.item.img }} className="w-16 h-16 rounded-lg mr-3" resizeMode="contain"/>
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-900">
                                {item.item.name}
                            </Text>
                            <Text className="text-gray-700">{item.price} 💰</Text>
                        </View>
                         <Text className="text-gray-500 text-sm text-right w-60">
                            {i18n.t(item.item.description)}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};

export default OrderDetail;
