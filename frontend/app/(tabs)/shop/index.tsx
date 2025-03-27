import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ModalCart from "@/components/shop/ModalCart";
import ModalConfirmPurchase from "@/components/shop/ModalConfirmPurchase";
import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { buyItem, getListItem } from "@/services/ShopService";
import Item from "@/type/feature/shop/item";

const Shop = () => {
  const router = useRouter();
  const { i18n } = useLanguage();
  const { setErrorMessage, setErrorVisible } = useErrors();
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<Item[]>([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  // Nouveaux états pour la recherche et le filtre
  const [search, setSearch] = useState("");
  const [filterFromShop, setFilterFromShop] = useState<string>("all"); // "all", "true", "false"

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
  }, [i18n, setErrorMessage, setErrorVisible]);

  const addToCart = (item: Item) => {
    if (!item.fromShop && cart.some((cartItem) => cartItem.id === item.id)) return;
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

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterFromShop === "all" ||
        (filterFromShop === "true" && item.fromShop === true) ||
        (filterFromShop === "false" && item.fromShop === false);
      return matchesSearch && matchesFilter;
    });
  }, [items, search, filterFromShop]);

  return (
    <View className="flex-1">
      <TouchableOpacity
        onPress={() => setCartVisible(!cartVisible)}
        className="fixed top-28 left-5 z-50"
      >
        <Feather name="shopping-cart" size={28} color="black" />
        {cart.length > 0 && (
          <View className="right-2 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">{cart.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      <View className="w-4/5 mx-auto mt-4 h-12">
        <View className="flex-row">
          <TextInput
            placeholder={i18n.t("Search")}
            value={search}
            onChangeText={setSearch}
            className="flex-[0.7] bg-white rounded-lg mr-2 px-2 py-2 placeholder-gray-500"
          />
          <View className="flex-[0.3] bg-white rounded-lg">
            <Picker
              selectedValue={filterFromShop}
              onValueChange={(itemValue) => setFilterFromShop(itemValue)}
            >
              <Picker.Item label={i18n.t("All items")} value="all" />
              <Picker.Item label={i18n.t("From shop only")} value="true" />
              <Picker.Item label={i18n.t("Not from shop")} value="false" />
            </Picker>
          </View>
        </View>
      </View>


      <ScrollView
        className="flex-1 bg-gray-100"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="bg-gray-100 items-center pt-6">
          <View className="w-full flex-row items-center justify-between px-6">
            <Text className="text-2xl font-bold text-center left-1/2">
              {i18n.t("Shop")}
            </Text>
          </View>
          <View className="flex flex-row flex-wrap justify-center mb-24">
            {filteredItems.map((item) => {
              const isInCart = cart.some((cartItem) => cartItem.id === item.id);
              const disableAdd = isInCart && !item.fromShop;
              return (
                <View
                  className="bg-white rounded-xl p-4 m-2 w-40 items-center shadow-lg justify-around"
                >
                  <Image
                    source={{ uri: item.img }}
                    className="w-20 h-20 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="text-lg font-semibold text-center">
                    {item.name}
                  </Text>
                  <Text
                    className={`text-sm ${item.rarity === "Legendary" ? "text-yellow-500" : "text-gray-500"
                      }`}
                  >
                    {item.rarity}
                  </Text>
                  <Text className="text-xs text-gray-600 text-center">
                    {item.description}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-lg font-bold">{item.price}</Text>
                    <Image
                      source={{
                        uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png",
                      }}
                      className="w-5 h-5 ml-1"
                      resizeMode="contain"
                    />
                  </View>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-lg font-bold">{item.user}</Text>
                  </View>
                  <TouchableOpacity
                    className={`px-3 py-2 rounded-lg mt-2 ${disableAdd ? "bg-gray-400" : "bg-blue-500"
                      }`}
                    onPress={() => addToCart(item)}
                  >
                    <Text className="text-white font-bold">
                      {i18n.t("Add to cart")}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

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
    </View>
  );
};

export default Shop;
