import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { getShopCrown } from "@/services/ShopService";
import ShopCrown from "@/type/feature/shop/shop_crown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function BuyShopCrown() {
  const router = useRouter();
  const { i18n } = useLanguage();
  const { setErrorMessage, setErrorVisible } = useErrors();
  const [items, setItems] = useState<ShopCrown[]>([]);
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web" && width > 768;
  const numColumns = isWeb ? 2 : 1;

  useEffect(() => {
    (async () => {
      try {
        setItems(await getShopCrown());
      } catch {
        setErrorMessage("An error occurred");
        setErrorVisible(true);
      }
    })();
  }, []);

  const buy = async (price: number) => {
    try {
      await AsyncStorage.setItem("amount", price.toString());
      router.push("/checkout/crown");
    } catch {
      setErrorMessage("An error occurred");
      setErrorVisible(true);
    }
  };

  return (
    <ScrollView style={styles.page}>
      <Text style={styles.title}>Buy Crowns</Text>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id.toString()}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={[styles.card, { flexBasis: `${100 / numColumns - 5}%` }]}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.numberOfCrowns} Crowns</Text>
            <Text style={styles.price}>{item.price} €</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => buy(item.price)}
            >
              <Text style={styles.buttonText}>Buy</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F5FFF0",
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 8,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
