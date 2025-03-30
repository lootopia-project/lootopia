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
    allItems,
    itemUser,
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
        { id: null, name: "", quantity: "1", img: "" },
    ]);

    const [itemsRequested, setItemsRequested] = useState([
        { id: null, name: "", quantity: "1", img: "" },
    ]);

    const removeRequestedItem = (index: number) => {
        setItemsRequested(itemsRequested.filter((_, i) => i !== index));
    };

    const removeOfferedItem = (index: number) => {
        setItemsOffered(itemsOffered.filter((_, i) => i !== index));
    };

    const handlePropose = async () => {
        const validOffered = itemsOffered.every(
            (item) => item.id && parseInt(item.quantity, 10) > 0
        );

        const parsedItemsRequested = itemsRequested.map((r) => {
            const itemRef = allItems.find((i) => i.id === Number(r.id));
            return {
                id: itemRef?.id,
                name: itemRef?.name || "",
                quantity: parseInt(r.quantity, 10),
            };
        });

        const invalidRequest =
            parsedItemsRequested.some((r) => isNaN(r.quantity) || r.quantity <= 0 || !r.id) ||
            !validOffered;

        if (invalidRequest) {
            setErrorMessage(i18n.t("Please fill all fields correctly"));
            setShowItemModal(false);
            setErrorVisible(true);
            return;
        }

        const [email1, email2] = [
            cleanEmail(usersConnected?.email ?? ""),
            cleanEmail(usersTalked),
        ].sort();
        const discussionKey = `${email1}-${email2}`;

        const messageText = `${i18n.t("I propose")} ${itemsOffered
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
            itemsOffered: itemsOffered.map((item) => ({
                id: Number(item.id),
                name: item.name,
                quantity: parseInt(item.quantity, 10),
            })),
            itemsRequested: parsedItemsRequested,
        });

        setText("");
        setShowItemModal(false);
    };

    return (
        <ScrollView className="border-b border-gray-300 mb-4 pb-4">
            <Text className="font-semibold mb-2">{i18n.t("Items to offer")}</Text>

            {itemsOffered.map((itm, idx) => {
                const selected = itemUser.find((i) => i.id === Number(itm.id));

                return (
                    <View key={idx} className="mb-4">
                        <View className="bg-gray-100 rounded-md border border-gray-300 mb-2">
                            <Picker
                                selectedValue={itm.id}
                                onValueChange={(value) => {
                                    const updated = [...itemsOffered];
                                    const selectedItem = itemUser.find((i) => i.id === Number(value));
                                    updated[idx].id = value;
                                    updated[idx].name = selectedItem?.name || "";
                                    updated[idx].img = selectedItem?.img || "";
                                    setItemsOffered(updated);
                                }}
                            >
                                <Picker.Item label={i18n.t("Select an item")} value={null} />
                                {itemUser.map((itm) => (
                                    <Picker.Item
                                        key={itm.id}
                                        label={`${itm.name} (${itm.quantity})`}
                                        value={itm.id}
                                    />
                                ))}
                            </Picker>
                        </View>

                        {selected && (
                            <View className="flex-row items-center my-2 p-3 bg-gray-50 rounded-xl" style={{ gap: 10 }}>
                                <Image
                                    source={{ uri: selected.img }}
                                    style={{ width: 48, height: 48, borderRadius: 8 }}
                                    resizeMode="contain"
                                />
                                <Text className="font-medium">{selected.name}</Text>
                            </View>
                        )}

                        <TextInput
                            className="border px-2 py-1 rounded-md"
                            keyboardType="numeric"
                            value={itm.quantity}
                            onChangeText={(text) => {
                                const updated = [...itemsOffered];
                                const selected = itemUser.find((i) => i.id === Number(itm.id));
                                const maxQuantity = selected ? selected.quantity : 1;
                                const numericValue = parseInt(text, 10);

                                if (!isNaN(numericValue) && numericValue <= maxQuantity) {
                                    updated[idx].quantity = text;
                                } else if (!text) {
                                    updated[idx].quantity = "";
                                }

                                setItemsOffered(updated);
                            }}
                        />


                        {itemsOffered.length > 1 && (
                            <TouchableOpacity onPress={() => removeOfferedItem(idx)}>
                                <Text className="text-red-500 text-xl font-bold mt-1">✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            })}

            <TouchableOpacity
                onPress={() =>
                    setItemsOffered([
                        ...itemsOffered,
                        { id: null, name: "", quantity: "1", img: "" },
                    ])
                }
            >
                <Text className="text-blue-600 font-bold">
                    + {i18n.t("Add item to offer")}
                </Text>
            </TouchableOpacity>

            <Text className="font-semibold mt-6 mb-2">{i18n.t("Items wanted")}</Text>
            {itemsRequested.map((itm, idx) => {
                const selectedWantedItem = allItems.find((i) => i.id === Number(itm.id));

                return (
                    <View key={idx} className="mb-4">

                        <View className="bg-gray-100 rounded-md border border-gray-300 mb-2">
                            <Picker
                                selectedValue={itm.id}
                                onValueChange={(value) => {
                                    const updated = [...itemsRequested];
                                    const selected = allItems.find((i) => i.id === Number(value));
                                    updated[idx].id = value;
                                    updated[idx].name = selected?.name || "";
                                    updated[idx].img = selected?.img || "";
                                    setItemsRequested(updated);
                                }}
                            >
                                <Picker.Item label={i18n.t("Select an item")} value={null} />
                                {allItems.map((itm) => (
                                    <Picker.Item key={itm.id} label={itm.name} value={itm.id} />
                                ))}
                            </Picker>
                        </View>

                        {selectedWantedItem && selectedWantedItem.img && (
                            <View className="flex-row items-center my-2 p-3 bg-gray-50 rounded-xl" style={{ gap: 10 }}>
                                <Image
                                    source={{ uri: selectedWantedItem.img }}
                                    style={{ width: 48, height: 48, borderRadius: 8 }}
                                    resizeMode="contain"
                                />
                                <Text className="font-medium">{selectedWantedItem.name}</Text>
                            </View>
                        )}

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

                        {itemsRequested.length > 1 && (
                            <TouchableOpacity onPress={() => removeRequestedItem(idx)}>
                                <Text className="text-red-500 text-xl font-bold mt-1">✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            })}

            <TouchableOpacity
                onPress={() =>
                    setItemsRequested([
                        ...itemsRequested,
                        { id: null, name: "", quantity: "1", img: "" },
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