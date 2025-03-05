import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { buyItem, getListItem } from "@/services/ShopService";
import Item from "@/type/feature/shop/item";
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ModalCart from "@/components/shop/ModalCart";
import ModalConfirmPurchase from "@/components/shop/ModalConfirmPurchase";

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

  const addToCart = (item: Item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const openConfirmModal = () => {
    setConfirmModalVisible(true);
    setCartVisible(false);
  };

  const confirmPurchase = async () => {
    const response=await buyItem(cart)
    setCart([]);
    setConfirmModalVisible(false);
    setCartVisible(false);
  };

  return (
    <View className="flex-1 bg-gray-100 items-center pt-6">
  <View className="w-full flex-row items-center justify-between px-6">
    
    <TouchableOpacity onPress={() => router.push("/shop/purchase-history")}>
      <Text className="text-lg text-blue-500 font-semibold">{i18n.t("Purchase History")}</Text>
    </TouchableOpacity>

    <Text className="text-2xl font-bold text-center absolute left-1/2 -translate-x-1/2">
      {i18n.t("Shop")}
    </Text>

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

     <ModalCart
        cart={cart}
        cartVisible={cartVisible}
        setCartVisible={setCartVisible}
        removeFromCart={removeFromCart}
        openConfirmModal={openConfirmModal}
      />

      <ModalConfirmPurchase
        confirmModalVisible={confirmModalVisible}
        cart={cart}
        setConfirmModalVisible={setConfirmModalVisible}
        confirmPurchase={confirmPurchase}
      />

    
    </View>
  );
};

export default Shop;
