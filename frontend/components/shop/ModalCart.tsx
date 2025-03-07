import { useLanguage } from "@/hooks/providers/LanguageProvider";
import ModalCartProps from "@/type/feature/shop/modal_cart_props";
import { Feather } from "@expo/vector-icons";
import { Modal, ScrollView, TouchableOpacity, View,Image,Text } from "react-native";


const ModalCart: React.FC<ModalCartProps> = ({cartVisible,setCartVisible,cart,removeFromCart,openConfirmModal}) => {
      const { i18n } = useLanguage();
    return (
        <Modal
        transparent={true}
        visible={cartVisible}
        animationType="fade"
        onRequestClose={() => setCartVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 flex-row justify-end bg-black/50"
          onPress={() => setCartVisible(false)} 
        > 
          <View className="bg-white h-full w-80 shadow-xl p-6" onStartShouldSetResponder={() => true}>
            <Text className="text-lg font-semibold mb-3">{i18n.t("Your Cart")}</Text>

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

            {cart.length > 0 && (
              <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-lg mt-4 w-full" onPress={openConfirmModal}>
                <Text className="text-white text-center font-bold">{i18n.t("Proceed to checkout")}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity className="bg-gray-400 px-4 py-2 rounded-lg mt-4 w-full" onPress={() => setCartVisible(false)}>
              <Text className="text-white text-center font-bold">{i18n.t("Close")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );

}

export default ModalCart;