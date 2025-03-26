import React, { useEffect, useState } from "react";
import {
    Button,
    FlatList,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { sendPrivateMessage } from "@/services/MessageService";
import ItemExchangeCardProps from "@/type/feature/message/ItemExchangeCardProps";
import { proposeExchange } from "@/services/ExchangeService";

const ItemExchangeCard: React.FC<ItemExchangeCardProps> = ({
    item,
    allItems,
    usersConnected,
    usersTalked,
    i18n,
    cleanEmail,
    setText,
    setErrorMessage,
    setErrorVisible,
    setShowItemModal,
    setMessages,
}) => {
    const [offeredQty, setOfferedQty] = useState(String(item.quantity));
    const [wantedItemId, setWantedItemId] = useState<string | null>(null);
    const [wantedQty, setWantedQty] = useState("1");

    const handlePropose = async () => {
        console.log("Propose exchange");

        if (!wantedItemId) {
            setErrorMessage(i18n.t("Please select an item you want"));
            setShowItemModal(false)
            setErrorVisible(true);
            return;
        }

        const offeredQuantity = parseInt(offeredQty, 10);
        const maxAvailable = item.quantity;

        if (isNaN(offeredQuantity) || offeredQuantity <= 0) {
            setErrorMessage(i18n.t("Please enter a valid quantity to offer"));
            setShowItemModal(false)
            setErrorVisible(true);
            return;
        }

        if (offeredQuantity > maxAvailable) {
            setErrorMessage(`${i18n.t("You only have")} ${maxAvailable} ${item.name}`);
            setShowItemModal(false)
            setErrorVisible(true);
            return;
        }

        const wantedItem = allItems.find((i) => i.id === Number(wantedItemId));
        const [email1, email2] = [cleanEmail(usersConnected?.email), cleanEmail(usersTalked)].sort();
        const discussionKey = `${email1}-${email2}`;

        const messageText =
            `${i18n.t("I propose")} ${offeredQty} ${item.name} ${i18n.t("against")} ${wantedQty} ${wantedItem?.name}`;

        const messageKey = await sendPrivateMessage(
            usersConnected,
            usersTalked,
            messageText,
            setMessages,
            "pending"
        );

        await proposeExchange(discussionKey, {
            proposer: cleanEmail(usersConnected?.email),
            receiver: usersTalked,
            messageId: messageKey,
            item: {
                id: item.id,
                name: item.name,
                quantity: offeredQuantity,
            },
            requestedItem: {
                id: wantedItem?.id,
                name: wantedItem?.name,
                quantity: parseInt(wantedQty),
            },
        });

        setText("");
        setShowItemModal(false);
    };

    console.log("ItemExchangeCard", item);


    return (
        <View className="border-b border-gray-300 mb-4 pb-4">
            <View className="flex-row items-center mb-2">
                <Image
                    source={{
                        uri: item.img && item.img.startsWith("http")
                            ? item.img
                            : "https://cdn-icons-png.flaticon.com/512/8140/8140405.png",
                    }}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        marginRight: 12,
                    }}
                    resizeMode="contain"
                />



                <View className="flex-1">
                    <Text className="text-black font-semibold">{item.name}</Text>
                    <Text className="text-gray-500 text-sm">
                        {i18n.t("Quantity")} {item.quantity}
                    </Text>
                </View>
            </View>

            <Text className="text-sm font-semibold mb-1">{i18n.t("Quantity to offer")} :</Text>
            <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
                keyboardType="numeric"
                value={offeredQty}
                onChangeText={setOfferedQty}
            />

            <Text className="text-sm font-semibold mb-1">{i18n.t("Choose desired item")} :</Text>
            <View className="border border-gray-300 rounded-lg px-2 mb-2">
                <Picker
                    selectedValue={wantedItemId}
                    onValueChange={(value) => setWantedItemId(value)}
                >
                    <Picker.Item label={i18n.t("Select an item")} value={null} />
                    {allItems.map((itm) => (
                        <Picker.Item key={itm.id} label={itm.name} value={itm.id} />
                    ))}
                </Picker>
            </View>

            <Text className="text-sm font-semibold mb-1">{i18n.t("Quantity wanted")} :</Text>
            <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
                keyboardType="numeric"
                value={wantedQty}
                onChangeText={setWantedQty}
            />

            <TouchableOpacity
                className="bg-blue-500 py-2 rounded-lg"
                onPress={handlePropose}
            >
                <Text className="text-white text-center font-bold">{i18n.t("Propose")}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ItemExchangeCard;
