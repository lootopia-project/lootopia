import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { buyItem, getListItem } from "@/services/ShopService";
import Item from "@/type/feature/shop/item";
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView } from "react-native";
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
    const itemInCart = cart.filter(cartItem => cartItem.id === item.id);

    // Vérifie si la quantité max est atteinte
    if (item.sellerId && itemInCart.length >= item.quantity) {
      setErrorMessage(i18n.t("Not enough stock available"));
      setErrorVisible(true);
      return;
    }

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
    const response = await buyItem(cart);

    if (response.success) {
      setCart([]);
      router.push({
        pathname: "/shop/order-detail",
        params: { id: response.orderId },
      });
    } else {
      setErrorMessage(response.message);
      setErrorVisible(true);
    }
    setCartVisible(false);
    setConfirmModalVisible(false);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 bg-gray-100 items-center pt-6">
        <View className="w-full flex-row items-center justify-between px-6">
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
              {/* 🔥 Badge indiquant une vente par un joueur */}
              {item.sellerId && (
                <View className="absolute top-2 right-2 bg-yellow-400 px-2 py-1 rounded-full">
                  <Text className="text-xs font-bold text-white">{i18n.t("Player Sale")}</Text>
                </View>
              )}

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

              {/* 🔥 Affichage de la quantité si vendu par un joueur */}
              {item.sellerId && (
                <Text className="text-xs text-gray-600 text-center mt-1">{i18n.t("Available")}: {item.quantity}</Text>
              )}

              <TouchableOpacity className="bg-blue-500 px-3 py-2 rounded-lg mt-2" onPress={() => addToCart(item)}>
                <Text className="text-white font-bold">{i18n.t("Add to cart")}</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <ModalConfirmPurchase
          confirmModalVisible={confirmModalVisible}
          cart={cart}
          setConfirmModalVisible={setConfirmModalVisible}
          confirmPurchase={confirmPurchase}
        />

        <ModalCart
          cart={cart}
          cartVisible={cartVisible}
          setCartVisible={setCartVisible}
          removeFromCart={removeFromCart}
          openConfirmModal={openConfirmModal}
        />
      </View>
    </ScrollView>
  );
};

export default Shop;
