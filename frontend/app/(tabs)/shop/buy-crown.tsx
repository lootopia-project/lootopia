import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { getShopCrown } from "@/services/ShopService";
import ShopCrown from "@/type/feature/shop/shop_crown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";


const BuyShopCrown = () => {
const router = useRouter();
const { i18n } = useLanguage();
const { setErrorMessage, setErrorVisible } = useErrors();
const [crownShopItems, setCrownShopItems] = useState<ShopCrown[]>([]);


useEffect(() => {

    const fetchCrown = async () => {
        try {
            const response = await getShopCrown();
            setCrownShopItems(response);

        } catch (error) {
            setErrorMessage(i18n.t("An error occurred"));
            setErrorVisible(true);  
        }
    };

    fetchCrown();
}, [i18n]);


const buyCrown = async (amount: number) => {
    try {
        router.push("/checkout/crown");
        AsyncStorage.setItem('amount', amount.toString());
    } catch (error) {
        setErrorMessage(i18n.t("An error occurred"));
        setErrorVisible(true);  
    }
}
return (
    <View className="flex-1 bg-gray-100 items-center pt-6">
      <View className="w-full flex-row items-center justify-between px-6">
          <TouchableOpacity onPress={() => router.push("/shop/purchase-history")}>
            <Text className="text-lg text-blue-500 font-semibold">{i18n.t("Purchase History")}</Text>
          </TouchableOpacity>
      </View>
      <Text className="text-2xl font-bold mb-4">{i18n.t("Buy Crowns")}</Text>
      <FlatList
        data={crownShopItems}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 m-2 w-40 items-center shadow-lg">
            <Image source={{ uri: item.img }} className="w-16 h-16 mb-2" />
            <Text className="text-lg font-semibold text-center">{i18n.t(item.name)}</Text>
            <Text className="text-gray-500">{item.numberOfCrowns} {i18n.t("Crowns")}</Text>
            <Text className="text-lg font-bold mt-1">{item.price} €</Text>
            <TouchableOpacity className="bg-blue-500 px-3 py-2 rounded-lg mt-2" onPress={() => buyCrown(item.price)}>
              <Text className="text-white font-bold">{i18n.t("Buy")}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );

  };

export default BuyShopCrown;