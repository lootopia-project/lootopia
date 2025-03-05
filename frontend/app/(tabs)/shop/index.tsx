import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { getListItem } from "@/services/ShopService";
import Item from "@/type/feature/shop/item";
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, Modal } from "react-native";

// const shopItems = [
//   { 
//     id: 1, 
//     name: "Epic Sword", 
//     rarity: "Epic", 
//     price: 100, 
//     description: "A powerful sword imbued with magic.",
//     img: "https://lootopia.blob.core.windows.net/lootopia-object/key.png" 
//   },
//   { 
//     id: 2, 
//     name: "Golden key", 
//     rarity: "Legendary", 
//     price: 250, 
//     description: "An indestructible key made of gold.",
//     img: "https://lootopia.blob.core.windows.net/lootopia-object/key.png" 
//   },
//   { 
//     id: 3, 
//     name: "Wizard Staff", 
//     rarity: "Rare", 
//     price: 150, 
//     description: "A staff that boosts your magical powers.",
//     img: "https://lootopia.blob.core.windows.net/lootopia-object/key.png" 
//   },
//   { 
//     id: 4, 
//     name: "Dragon Helm", 
//     rarity: "Mythic", 
//     price: 300, 
//     description: "A helmet made from dragon scales.",
//     img: "https://lootopia.blob.core.windows.net/lootopia-object/key.png" 
//   }
// ];

const Shop = () => {
  const { i18n } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ name: string; price: number } | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const { setErrorMessage, setErrorVisible } = useErrors();

useEffect(() => {

    const fetchItem = async () => {
        try {
            const response = await getListItem();
            setItems(response);

        } catch (error) {
            setErrorMessage(i18n.t("An error occurred"));
            setErrorVisible(true);  
        }
    };

    fetchItem();
}, [i18n]);    

  const openModal = (itemName: string, itemPrice: number) => {
    setSelectedItem({ name: itemName, price: itemPrice });
    setModalVisible(true);
  };

  const buyItem = () => {
    if (selectedItem) {
      console.log(`✅ Purchased: ${selectedItem.name} for ${selectedItem.price} crowns`);
    }
    setModalVisible(false);
  };

  console.log(selectedItem)

  return (
    <View className="flex-1 bg-gray-100 items-center pt-6">
      <Text className="text-2xl font-bold mb-4">{i18n.t("Shop")}</Text>

      <FlatList
        data={items}
        numColumns={5} 
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 m-2 w-44 items-center shadow-lg">
            <Image source={{ uri: item.img }} className="w-20 h-20 mb-2" resizeMode="contain"/>
            <Text className="text-lg font-semibold text-center">{i18n.t(item.name)}</Text>
            <Text className={`text-sm ${item.rarity === "Legendary" ? "text-yellow-500" : "text-gray-500"}`}>
              {i18n.t(item.rarity)}
            </Text>
            <Text className="text-xs text-gray-600 text-center">{i18n.t(item.description)}</Text>
            
            {/* Prix + Icône couronne */}
            <View className="flex-row items-center mt-1">
              <Text className="text-lg font-bold">{item.price}</Text>
              <Image 
                source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png" }} 
                className="w-5 h-5 ml-1"
                resizeMode="contain"
              />
            </View>           

            {/* Bouton Acheter */}
            <TouchableOpacity 
              className="bg-blue-500 px-3 py-2 rounded-lg mt-2" 
              onPress={() => openModal(item.name, item.price)}
            >
              <Text className="text-white font-bold">{i18n.t("Buy")}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 🔥 MODAL DE CONFIRMATION 🔥 */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-80 items-center shadow-xl">
            <Text className="text-lg font-semibold mb-3">{i18n.t("Confirm Purchase")}</Text>

            {selectedItem && (
              <>
                <Text className="text-md">
                  {i18n.t("Do you want to buy {itemName} for {itemPrice} crowns?", { 
                     itemName: selectedItem?.name || "", 
                     itemPrice: selectedItem?.price || 0
                  })}
                </Text>
                {/* Prix + Icône couronne */}
                <View className="flex-row items-center mt-3">
                  <Text className="text-lg font-bold">{selectedItem.price}</Text>
                  <Image 
                    source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png" }} 
                    className="w-6 h-6 ml-1"
                    resizeMode="contain"
                  />
                </View>
              </>
            )}

            <View className="flex-row mt-4 space-x-4">
              <TouchableOpacity className="bg-gray-400 px-4 py-2 rounded-lg" onPress={() => setModalVisible(false)}>
                <Text className="text-white font-bold">{i18n.t("Cancel")}</Text>
              </TouchableOpacity>

              <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-lg" onPress={buyItem}>
                <Text className="text-white font-bold">{i18n.t("Confirm")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default Shop;
