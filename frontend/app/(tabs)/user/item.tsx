import React, { useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, Image, FlatList, Modal, TextInput } from 'react-native';
import { getListItemUser, addItemToShop } from '@/services/ShopService';
import Item from '@/type/feature/shop/item';
import { useLanguage } from '@/hooks/providers/LanguageProvider';
import { useErrors } from '@/hooks/providers/ErrorProvider';

const ItemView = () => {
    const [itemToShop, setItemToShop] = useState<Item>();
    const [items, setItems] = useState<Item[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const { i18n } = useLanguage();
    const { setErrorMessage, setErrorVisible } = useErrors();

    // Fonction de récupération des items
    const fetchItems = useCallback(async () => {
        try {
            const response = await getListItemUser();
            setItems(response);
        } catch (error) {
            setErrorMessage(i18n.t("An error occurred"));
            setErrorVisible(true);
        }
    }, [i18n, setErrorMessage, setErrorVisible]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const showModal = (item: Item) => {
        setItemToShop(item);
        setModalVisible(true);
    };

    const addToShop = async (item: Item) => {
        if (item.price <= 0 || !item.price) {
            setErrorMessage(i18n.t("Price is invalid"));
            setErrorVisible(true);
            return;
        }
        try {
            await addItemToShop(item);
            fetchItems();
            setModalVisible(false);
        } catch (error) {
            setErrorMessage(error.response.data);
            setErrorVisible(true);
        }
    };

    return (
        <View className="flex-1 items-center">
            <View className='flex flex-row flex-wrap justify-center mb-20'>
                {items.map((item) => (
                    <View className="bg-white rounded-xl p-4 m-2 w-40 items-center shadow-lg justify-between">
                        <Image source={{ uri: item.img }} className="w-20 h-20 mb-2" resizeMode="contain" />
                        <Text className="text-lg font-semibold text-center">{item.name}</Text>
                        <Text className={`text-sm ${item.rarity === "Legendary" ? "text-yellow-500" : "text-gray-500"}`}>
                            {item.rarity}
                        </Text>
                        <Text className="text-xs text-gray-600 text-center">{item.description}</Text>

                        <View className="flex-row items-center mt-1">
                            <Text className="text-lg font-bold">{item.price}</Text>
                            <Image source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png" }} className="w-5 h-5 ml-1" resizeMode="contain" />
                        </View>

                        <TouchableOpacity className="bg-blue-500 px-3 py-2 rounded-lg mt-2" onPress={() => showModal(item)}>
                            <Text className="text-white font-bold whitespace-nowrap">{i18n.t("Add to the shop")}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white p-5 rounded-lg">
                        <View className='flex-col items-center mb-2'>
                            <Text className="text-lg font-bold text-center mb-5">{i18n.t("Change the price if you want")}</Text>
                            <Text className="text-lg mb-2">
                                {itemToShop?.name}
                            </Text>
                            <TextInput
                                className="border rounded-lg p-3 text-base"
                                placeholder={i18n.t("Price")}
                                value={itemToShop?.price.toString()}
                                onChangeText={(text) => {
                                    if (itemToShop) {
                                        setItemToShop({ ...itemToShop, price: parseInt(text) });
                                    }
                                }}
                                autoCapitalize="none"
                            />
                        </View>
                        <View className='flex-row justify-around items-center'>
                            <TouchableOpacity className="bg-gray-500 px-3 py-2 rounded-lg" onPress={() => setModalVisible(false)}>
                                <Text className="text-white font-bold">{i18n.t("Close")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-green-500 px-3 py-2 rounded-lg" onPress={() => itemToShop && addToShop(itemToShop)}>
                                <Text className="text-white font-bold">{i18n.t("Add to the shop")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ItemView;
