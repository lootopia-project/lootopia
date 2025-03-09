import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { getUsersItem, putOnSale } from "@/services/UsersService";
import ItemUser from "@/type/feature/user/item_user";
import { useEffect, useState } from "react";
import { Modal, View, Text, Image, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

const Item = () => {
    const { i18n } = useLanguage();
    const { setErrorVisible, setErrorMessage } = useErrors();
    const [itemsUser, setItemsUser] = useState<ItemUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<ItemUser | null>(null);
    const [menuOpen, setMenuOpen] = useState<number | null>(null);
    const [sellModalVisible, setSellModalVisible] = useState(false);
    const [sellPrice, setSellPrice] = useState("");
    const [sellQuantity, setSellQuantity] = useState("");

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await getUsersItem();    
                const groupedItems: { [key: number]: ItemUser } = {};
                response.forEach((item: ItemUser) => {
                    if (!item.quantity) {
                        item.quantity = 1;
                    }
    
                    if (groupedItems[item.id]) {
                        groupedItems[item.id].quantity += item.quantity; 
                    } else {
                        groupedItems[item.id] = { ...item, quantity: item.quantity }; 
                    }
                });
    
                setItemsUser(Object.values(groupedItems));
            } catch (error) {
                setErrorMessage(i18n.t("An error occurred while fetching data"));
                setErrorVisible(true);
            } finally {
                setLoading(false);
            }
        };
    
        fetchItem();
    }, []);
    

    console.log(itemsUser);
    

    const handleConfirmSell =async () => {
        if (!selectedItem) return;
    
        const quantityToSell = parseInt(sellQuantity, 10);
        const priceToSell = parseFloat(sellPrice);
    
        if (isNaN(quantityToSell) || quantityToSell <= 0) {
            setSellModalVisible(false);
            setErrorMessage(i18n.t("Please enter a valid quantity"));
            setErrorVisible(true);
            return;
        }
    
        if (quantityToSell > selectedItem.quantity) {
            setSellModalVisible(false);

            setErrorMessage(i18n.t("You cannot sell more than you own"));
            setErrorVisible(true);
            return;
        }
    
        if (isNaN(priceToSell) || priceToSell <= 0) {
            setSellModalVisible(false);
            setErrorMessage(i18n.t("Please enter a valid price"));
            setErrorVisible(true);
            return;
        }
    
        console.log(`Selling ${quantityToSell}x ${selectedItem.name} at ${priceToSell} each`);

            const response=await putOnSale(selectedItem.id, priceToSell, quantityToSell);
            if(!response.success){
                setErrorMessage(response.message);
                setErrorVisible(true);
            }
    
        setSellModalVisible(false);
        setSelectedItem(null);
        setSellQuantity("");
        setSellPrice("");
    };

    const handleSell = (item: ItemUser) => {
    
        setSelectedItem(item);
        setSellPrice(""); 
        setSellModalVisible(true);
        setMenuOpen(null);
    };
    
    

    if (loading) {
        return (
            <View className="flex justify-center items-center h-screen">
                <Text className="text-lg font-semibold">{i18n.t("Loading...")}</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1">
        <View className="p-6">
            <Text className="text-2xl font-bold mb-4">{i18n.t("Your Items")}</Text>

            {itemsUser.length === 0 ? (
                <Text className="text-gray-500">{i18n.t("You don't own any items yet")}</Text>
            ) : (
                <View className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {itemsUser.map((item) => (
                        <View key={item.id} className="bg-white shadow-lg rounded-lg p-4 relative">
                            <TouchableOpacity 
                                className="absolute top-2 left-2"
                                onPress={() => setMenuOpen(menuOpen === item.id ? null : item.id)}
                            >
                                <Feather name="more-vertical" size={20} color="gray" />
                            </TouchableOpacity>

                            {menuOpen === item.id && (
                                <View className="absolute top-8 left-2 bg-white shadow-lg rounded-md p-2 z-10">
                                    <TouchableOpacity onPress={() => handleSell(item)}>
                                        <Text className="text-sm text-gray-700">{i18n.t("Sell")}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Text className="text-sm text-gray-700">{i18n.t("Trade")}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Text className="text-sm text-gray-700">{i18n.t("Auction")}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <Image
                                src={item.img}
                                source={{ uri: item.img }}
                                alt={item.name}
                                className="w-20 h-20 mx-auto mb-2"
                                resizeMode="contain"
                            />
                            <Text className="text-lg font-semibold text-center">{item.name}</Text>
                            <Text className={`text-sm text-center ${item.rarity === "Legendary" ? "text-yellow-500" : "text-gray-500"}`}>
                                {item.rarity}
                            </Text>
                            <Text className="text-xs text-gray-600 text-center">{item.description}</Text>

                            <View className="flex justify-between items-center mt-2">
                                <Text className="text-lg font-bold">{item.price}</Text>
                                <Text className="text-gray-700">x{item.quantity}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {sellModalVisible && selectedItem && (
                <Modal transparent={true} animationType="fade">
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white p-6 rounded-lg w-80 shadow-xl">
                            <Text className="text-lg font-semibold text-center mb-4">{i18n.t("Sell Item")}</Text>

                            <Image
                                source={{ uri: selectedItem.img }}
                                alt={selectedItem.name}
                                className="w-24 h-24 mx-auto mb-2"
                            />

                            <Text className="text-lg text-center">{selectedItem.name}</Text>

                            <View className="mt-4">
                                <Text className="text-sm text-gray-600">{i18n.t("Price per unit")}</Text>
                                <TextInput
                                    className="border p-2 rounded mt-1 w-full"
                                    placeholder="Enter price"
                                    keyboardType="numeric"
                                    value={sellPrice}
                                    onChangeText={setSellPrice}
                                />
                            </View>

                            <View className="mt-4">
                                <Text className="text-sm text-gray-600">{i18n.t("Quantity to sell")}</Text>
                                <TextInput
                                    className="border p-2 rounded mt-1 w-full"
                                    placeholder="Enter quantity"
                                    keyboardType="numeric"
                                    value={sellQuantity}
                                    onChangeText={setSellQuantity}
                                />
                            </View>

                            <View className="flex-row justify-between mt-6">
                                <TouchableOpacity className="bg-gray-400 px-4 py-2 rounded-lg" onPress={() => setSellModalVisible(false)}>
                                    <Text className="text-white">{i18n.t("Cancel")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-lg" onPress={handleConfirmSell}>
                                    <Text className="text-white">{i18n.t("Confirm")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    </ScrollView>
    );
};

export default Item;
