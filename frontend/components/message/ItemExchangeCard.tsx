import React, { useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { sendPrivateMessage } from "@/services/MessageService";
import { proposeExchange } from "@/services/ExchangeService";
import ItemExchangeCardProps from "@/type/feature/message/ItemExchangeCardProps";

const ItemExchangeCard: React.FC<ItemExchangeCardProps> = ({
    item,
    itemUser,
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
    const [itemsOffered, setItemsOffered] = useState([
        { id: item.id, name: item.name, quantity: String(item.quantity) },
    ]);
    const [itemsRequested, setItemsRequested] = useState([
        { id: null, name: "", quantity: "1" },
    ]);

    const addOfferedItem = () => {
        setItemsOffered([...itemsOffered, { id: null, name: "", quantity: "1" }]);
    };

    const removeOfferedItem = (index: number) => {
        const updated = itemsOffered.filter((_, i) => i !== index);
        setItemsOffered(updated);
    };

    const removeRequestedItem = (index: number) => {
        const updated = itemsRequested.filter((_, i) => i !== index);
        setItemsRequested(updated);
    };

    const handlePropose = async () => {
        const parsedItemsOffered = itemsOffered.map((o) => {
            const itemRef = itemUser.find((i) => i.id === Number(o.id));
            return {
                id: itemRef?.id || o.id,
                name: itemRef?.name || o.name,
                quantity: parseInt(o.quantity, 10),
            };
        });

        const parsedItemsRequested = itemsRequested.map((r) => {
            const itemRef = itemUser.find((i) => i.id === Number(r.id));
            return {
                id: itemRef?.id,
                name: itemRef?.name || "",
                quantity: parseInt(r.quantity, 10),
            };
        });

        const invalidOffer = parsedItemsOffered.some(
            (o) => isNaN(o.quantity) || o.quantity <= 0 || !o.id
        );
        const invalidRequest = parsedItemsRequested.some(
            (r) => isNaN(r.quantity) || r.quantity <= 0 || !r.id
        );

        if (invalidOffer || invalidRequest) {
            setErrorMessage(i18n.t("Please fill all fields correctly"));
            setShowItemModal(false);
            setErrorVisible(true);
            return;
        }

        const [email1, email2] = [
            cleanEmail(usersConnected?.email),
            cleanEmail(usersTalked),
        ].sort();
        const discussionKey = `${email1}-${email2}`;

        const messageText = `${i18n.t("I propose")} ${parsedItemsOffered
            .map((i) => `${i.quantity} ${i.name}`)
            .join(", ")} ${i18n.t("against")} ${parsedItemsRequested
                .map((i) => `${i.quantity} ${i.name}`)
                .join(", ")}`;

        const messageKey = await sendPrivateMessage(
            usersConnected,
            usersTalked,
            messageText,
            setMessages,
            "pending"
        );

        await proposeExchange(discussionKey, {
            proposer: usersConnected?.email,
            receiver: usersTalked,
            messageId: messageKey,
            itemsOffered: parsedItemsOffered,
            itemsRequested: parsedItemsRequested,
        });

        setText("");
        setShowItemModal(false);
    };



    return (
        <ScrollView className="border-b border-gray-300 mb-4 pb-4">
            <Text className="font-semibold mb-2">{i18n.t("Items to offer")}</Text>
            {itemsOffered.map((itm, idx) => (
                <View key={idx} className="mb-2">
                    <View className="flex-row items-center justify-between">
                        <Image
                            source={{
                                uri: item.img && item.img.startsWith("http")
                                    ? item.img
                                    : "https://cdn-icons-png.flaticon.com/512/8140/8140405.png",
                            }}
                            style={{ width: 48, height: 48, borderRadius: 8 }}
                            resizeMode="contain"
                        />
                        {idx !== 0 && (
                            <TouchableOpacity onPress={() => removeOfferedItem(idx)}>
                                <Text className="text-red-500 text-xl font-bold">✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <Picker
                        selectedValue={itm.id}
                        onValueChange={(value) => {
                            const updated = [...itemsOffered];
                            updated[idx].id = value;
                            updated[idx].name =
                                allItems.find((i) => i.id === Number(value))?.name || "";
                            setItemsOffered(updated);
                        }}
                    >
                        <Picker.Item label={i18n.t("Select an item")} value={null} />
                        {allItems.map((itm) => (
                            <Picker.Item key={itm.id} label={itm.name} value={itm.id} />
                        ))}
                    </Picker>

                    <TextInput
                        className="border px-2 py-1 rounded-md"
                        keyboardType="numeric"
                        value={itm.quantity}
                        onChangeText={(text) => {
                            const updated = [...itemsOffered];
                            updated[idx].quantity = text;
                            setItemsOffered(updated);
                        }}
                    />
                </View>
            ))}

            <TouchableOpacity onPress={addOfferedItem}>
                <Text className="text-blue-600 font-bold">
                    + {i18n.t("Add item to offer")}
                </Text>
            </TouchableOpacity>

            <Text className="font-semibold mt-4 mb-2">{i18n.t("Items wanted")}</Text>
            {itemsRequested.map((itm, idx) => (
                <View key={idx} className="mb-2">
                    <View className="flex-row justify-between items-center">
                        <Picker
                            selectedValue={itm.id}
                            style={{ flex: 1 }}
                            onValueChange={(value) => {
                                const updated = [...itemsRequested];
                                updated[idx].id = value;
                                updated[idx].name =
                                    allItems.find((i) => i.id === Number(value))?.name || "";
                                setItemsRequested(updated);
                            }}
                        >
                            <Picker.Item label={i18n.t("Select an item")} value={null} />
                            {allItems.map((itm) => (
                                <Picker.Item key={itm.id} label={itm.name} value={itm.id} />
                            ))}
                        </Picker>

                        {itemsRequested.length > 1 && (
                            <TouchableOpacity onPress={() => removeRequestedItem(idx)}>
                                <Text className="text-red-500 text-xl font-bold ml-2">✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TextInput
                        className="border px-2 py-1 rounded-md"
                        keyboardType="numeric"
                        value={itm.quantity}
                        onChangeText={(text) => {
                            const updated = [...itemsRequested];
                            updated[idx].quantity = text;
                            setItemsRequested(updated);
                        }}
                    />
                </View>
            ))}

            <TouchableOpacity
                onPress={() =>
                    setItemsRequested([
                        ...itemsRequested,
                        { id: null, name: "", quantity: "1" },
                    ])
                }
            >
                <Text className="text-blue-600 font-bold">
                    + {i18n.t("Add item wanted")}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="bg-blue-500 py-2 mt-4 rounded-lg"
                onPress={handlePropose}
            >
                <Text className="text-white text-center font-bold">
                    {i18n.t("Propose")}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ItemExchangeCard;
