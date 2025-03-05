import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { buyItem, getListItem } from "@/services/ShopService";
import Item from "@/type/feature/shop/item";
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Shop = () => {
  const router = useRouter();
  const { i18n } = useLanguage();
  const [cartVisible, setCartVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<Item[]>([]);
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

  // 🔥 Ajouter un article au panier
  const addToCart = (item: Item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  // 🔥 Supprimer un article du panier
  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // 🔥 Ouvrir le modal de confirmation d'achat
  const openConfirmModal = () => {
    setConfirmModalVisible(true);
    setCartVisible(false);
  };

  // 🔥 Confirmer l'achat du panier
  const confirmPurchase = async () => {
    const response=await buyItem(cart)
    setCart([]);
    setConfirmModalVisible(false);
    setCartVisible(false);
  };

  return (
    <View className="flex-1 bg-gray-100 items-center pt-6">
  {/* 🔥 Header avec "Purchase History", "Shop", et le panier */}
  <View className="w-full flex-row items-center justify-between px-6">
    
    {/* 🔥 Bouton Purchase History */}
    <TouchableOpacity onPress={() => router.push("/shop/purchase-history")}>
      <Text className="text-lg text-blue-500 font-semibold">{i18n.t("Purchase History")}</Text>
    </TouchableOpacity>

    {/* 🔥 Titre centré "Shop" */}
    <Text className="text-2xl font-bold text-center absolute left-1/2 -translate-x-1/2">
      {i18n.t("Shop")}
    </Text>

    {/* 🔥 Icône du Panier */}
    <TouchableOpacity onPress={() => setCartVisible(!cartVisible)} className="relative">
      <Feather name="shopping-cart" size={28} color="black" />
      {cart.length > 0 && (
        <View className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
          <Text className="text-white text-xs font-bold">{cart.length}</Text>
        </View>
      )}
    </TouchableOpacity>
  </View>

      <FlatList
        data={items}
        numColumns={5}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 m-2 w-44 items-center shadow-lg">
            <Image source={{ uri: item.img }} className="w-20 h-20 mb-2" resizeMode="contain" />
            <Text className="text-lg font-semibold text-center">{i18n.t(item.name)}</Text>
            <Text className={`text-sm ${item.rarity === "Legendary" ? "text-yellow-500" : "text-gray-500"}`}>
              {i18n.t(item.rarity)}
            </Text>
            <Text className="text-xs text-gray-600 text-center">{i18n.t(item.description)}</Text>

            <View className="flex-row items-center mt-1">
              <Text className="text-lg font-bold">{item.price}</Text>
              <Image source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png" }} className="w-5 h-5 ml-1" resizeMode="contain" />
            </View>

            <TouchableOpacity className="bg-blue-500 px-3 py-2 rounded-lg mt-2" onPress={() => addToCart(item)}>
              <Text className="text-white font-bold">{i18n.t("Add to cart")}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        transparent={true}
        visible={cartVisible}
        animationType="fade"
        onRequestClose={() => setCartVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 flex-row justify-end bg-black/50"
          onPress={() => setCartVisible(false)} // 🔥 Fermer le panier si on clique en dehors
        >
          <View className="bg-white h-full w-80 shadow-xl p-6" onStartShouldSetResponder={() => true}>
            <Text className="text-lg font-semibold mb-3">{i18n.t("Your Cart")}</Text>

            {/* 🔥 Liste des articles du panier */}
            <ScrollView>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <View key={item.id} className="flex-row justify-between items-center py-2 border-b">
                    <Text>{i18n.t(item.name)}</Text>
                    <View className="flex-row items-center">
                      <Text className="font-bold">{item.price}</Text>
                      <Image
                        source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png" }}
                        className="w-5 h-5 ml-1"
                        resizeMode="contain"
                      />
                    </View>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Feather name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text className="text-center text-gray-500">{i18n.t("Your cart is empty")}</Text>
              )}
            </ScrollView>

            {cart.length > 0 && (
              <View className="flex-row justify-between items-center mt-4 border-t pt-4">
                <Text className="text-lg font-semibold">Total</Text>
                <View className="flex-row items-center">
                  <Text className="text-lg font-bold">{cart.reduce((total, item) => total + item.price, 0)}</Text>
                  <Image
                    source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png" }}
                    className="w-6 h-6 ml-1"
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}

            {/* 🔥 Bouton pour valider le panier */}
            {cart.length > 0 && (
              <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-lg mt-4 w-full" onPress={openConfirmModal}>
                <Text className="text-white text-center font-bold">{i18n.t("Proceed to checkout")}</Text>
              </TouchableOpacity>
            )}

            {/* 🔥 Fermer le panier */}
            <TouchableOpacity className="bg-gray-400 px-4 py-2 rounded-lg mt-4 w-full" onPress={() => setCartVisible(false)}>
              <Text className="text-white text-center font-bold">{i18n.t("Close")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

{/* 🔥 MODAL DE CONFIRMATION (Premier Plan) */}
    <Modal
      transparent={true}
      visible={confirmModalVisible}
      animationType="fade"
      onRequestClose={() => setConfirmModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-6 w-80 items-center shadow-xl">
          <Text className="text-lg font-semibold mb-3">{i18n.t("Confirm Purchase")}</Text>
          <Text className="text-md text-center">{i18n.t("Are you sure you want to buy these items?")}</Text>

          {/* 🔥 Liste des articles du panier */}
          <ScrollView className="max-h-40 w-full mt-4">
            {cart.map((item) => (
              <View key={item.id} className="flex-row justify-between items-center w-full py-2 border-b">
                <Text className="text-sm">{i18n.t(item.name)}</Text>
                <View className="flex-row items-center">
                  <Text className="font-bold">{item.price}</Text>
                  <Image
                    source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png" }}
                    className="w-4 h-4 ml-1"
                    resizeMode="contain"
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          {/* 🔥 Total du panier avec icône couronne */}
          <View className="flex-row items-center mt-4">
            <Text className="text-xl font-bold">{cart.reduce((total, item) => total + item.price, 0)}</Text>
            <Image
              source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png" }}
              className="w-6 h-6 ml-2"
              resizeMode="contain"
            />
          </View>

          {/* 🔥 Boutons d'action */}
          <View className="flex-row mt-4 space-x-4">
            <TouchableOpacity className="bg-gray-400 px-4 py-2 rounded-lg" onPress={() => setConfirmModalVisible(false)}>
              <Text className="text-white font-bold">{i18n.t("Cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-lg" onPress={confirmPurchase}>
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
