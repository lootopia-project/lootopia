import { useLanguage } from "@/hooks/providers/LanguageProvider";
import ModalConfirmPurchaseProps from "@/type/feature/shop/modal_confirm_purchase_props";
import { Modal, View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

const ModalConfirmPurchase: React.FC<ModalConfirmPurchaseProps> = ({ confirmModalVisible, cart, setConfirmModalVisible, confirmPurchase }) => {
    const { i18n } = useLanguage();

    const groupedCart = cart.reduce((acc, item) => {
        const existingItem = acc.find((i) => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            acc.push({ ...item, quantity: 1 });
        }
        return acc;
    }, [] as (typeof cart[0] & { quantity: number })[]);

    const shouldScroll = groupedCart.length > 5;

    return (
        <Modal
            transparent={true}
            visible={confirmModalVisible}
            animationType="fade"
            onRequestClose={() => setConfirmModalVisible(false)}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white rounded-lg p-6 w-96 items-center shadow-xl">
                    <Text className="text-xl font-semibold mb-3">{i18n.t("Confirm Purchase")}</Text>
                    <Text className="text-md text-center">{i18n.t("Are you sure you want to buy these items?")}</Text>

                    {shouldScroll ? (
                        <ScrollView className="max-h-60 w-full mt-4">
                            {groupedCart.map((item) => (
                                <View key={item.id} className="flex-row justify-between items-center w-full py-2 border-b">
                                    <Text className="text-sm">{item.name}</Text>
                                    <View className="flex-row items-center">
                                        <Text className="font-bold">{item.price}</Text>
                                        <Image
                                            source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png" }}
                                            className="w-4 h-4 ml-1"
                                            resizeMode="contain"
                                        />
                                        {item.quantity > 1 && (
                                            <Text className="text-gray-700 text-sm ml-2">x{item.quantity}</Text>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        groupedCart.map((item) => (
                            <View key={item.id} className="flex-row justify-between items-center w-full py-2 border-b">
                                <Text className="text-sm">{item.name}</Text>
                                <View className="flex-row items-center">
                                    <Text className="font-bold">{item.price}</Text>
                                    <Image
                                        source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png" }}
                                        className="w-4 h-4 ml-1"
                                        resizeMode="contain"
                                    />
                                    {item.quantity > 1 && (
                                        <Text className="text-gray-700 text-sm ml-2">x{item.quantity}</Text>
                                    )}
                                </View>
                            </View>
                        ))
                    )}

                    <View className="flex-row items-center mt-4">
                        <Text className="text-2xl font-bold">
                            {groupedCart.reduce((total, item) => total + item.price * item.quantity, 0)}
                        </Text>
                        <Image
                            source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png" }}
                            className="w-6 h-6 ml-2"
                            resizeMode="contain"
                        />
                    </View>

                    <View className="flex-row mt-4 space-x-4">
                        <TouchableOpacity className="bg-gray-400 px-5 py-2 rounded-lg" onPress={() => setConfirmModalVisible(false)}>
                            <Text className="text-white font-bold">{i18n.t("Cancel")}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity className="bg-green-500 px-5 py-2 rounded-lg" onPress={confirmPurchase}>
                        <Text className="text-white font-bold">{i18n.t("Confirm")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ModalConfirmPurchase;
