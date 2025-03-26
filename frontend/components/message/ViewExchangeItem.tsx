import React from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, Button } from "react-native";
import ItemExchangeCard from "./ItemExchangeCard";
import ViewExchangeItemProps from "@/type/feature/message/ViewExchangeItemProps";

const ViewExchangeItem: React.FC<ViewExchangeItemProps> = ({
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
    showItemModal,
    setMessages,
}) => {
    return (
        <>
            <TouchableOpacity
                className="bg-green-500 py-2 rounded-lg mb-4"
                onPress={() => setShowItemModal(true)}
            >
                <Text className="text-white text-center font-bold">📦 {i18n.t("Propose a item")}</Text>
            </TouchableOpacity>

            <Modal
                visible={showItemModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowItemModal(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="w-11/12 bg-white p-6 rounded-xl shadow-md max-h-[90%]">
                        <Text className="text-lg font-bold mb-4">
                            📦 {i18n.t("Your items to share")}
                        </Text>

                        <FlatList
                            data={itemUser || []}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) =>
                                usersConnected && usersTalked ? (
                                    <ItemExchangeCard
                                        item={item}
                                        allItems={allItems}
                                        usersConnected={usersConnected}
                                        usersTalked={usersTalked}
                                        i18n={i18n}
                                        cleanEmail={cleanEmail}
                                        setText={setText}
                                        setErrorMessage={setErrorMessage}
                                        setErrorVisible={setErrorVisible}
                                        setShowItemModal={setShowItemModal}
                                        setMessages={setMessages}
                                    />
                                ) : null
                            }
                            ListEmptyComponent={
                                <Text className="text-center text-gray-500">
                                    {i18n.t("No items found")}
                                </Text>
                            }
                        />

                        <Button title={i18n.t("Close")} onPress={() => setShowItemModal(false)} />
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default ViewExchangeItem;
