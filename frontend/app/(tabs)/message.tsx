import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { fetchTreasureHunt } from "@/services/MessageHunting";
import { FontAwesome } from "@expo/vector-icons";
import { getHuntingsForMessages } from "@/services/HuntingService";
import Users from "@/type/feature/auth/users";
import Messages from "@/type/feature/message/message";
import { useRouter } from "expo-router";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import LastMessageHunting from "@/type/feature/message/LastMessageHunting";
import LastMessage from "@/type/feature/message/LastMessage";
import { useErrors } from "@/hooks/providers/ErrorProvider";

const Message = () => {
    const { i18n } = useLanguage();
    const [messages, setMessages] = useState<Messages[]>([]);
    const [text, setText] = useState<string>("");
    const [user, setUser] = useState<Users>();
    const [organizerId, setOrganizerId] = useState<string>("");
    const [lastMessages, setLastMessage] = useState<LastMessage[]>([]);
    const [discussionClicked, setDiscussionClicked] = useState<boolean>(false);
    const [discussionId, setDiscussionId] = useState<number | null>(null);
    const db = getDatabase();
    const router = useRouter();
    const { setErrorMessage, setErrorVisible } = useErrors();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const huntings: LastMessageHunting = await getHuntingsForMessages();
                setUser(huntings.user);
                setLastMessage(huntings.lastMessage);

                if (discussionId) {
                    const huntData = await fetchTreasureHunt(discussionId.toString());
                    setOrganizerId(huntData.organizer);

                    const messagesRef = ref(db, `treasureHunts/${discussionId}/messages`);
                    onValue(messagesRef, (snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            const parsedMessages: Messages[] = Object.keys(data).map((key) => ({
                                id: key,
                                ...data[key],
                            }));
                            setMessages(parsedMessages);
                        } else {
                            setMessages([]);
                        }
                    });
                }
            } catch (error) {
                setErrorMessage(i18n.t("An error occurred while fetching data"));
                setErrorVisible(true);
            }
        };

        fetchData();
    }, [db, discussionId]);

    const handleSend = async () => {
        if (text.trim()) {
            try {
                const message = {
                    sender: user?.nickname || "Anonyme",
                    text: text.trim(),
                    timestamp: new Date().toISOString(),
                };

                const messagesRef = ref(db, `treasureHunts/${discussionId}/messages`);
                await push(messagesRef, message);
                setText("");
            } catch (error) {
                setErrorMessage(i18n.t("An error occurred while sending the message."));
                setErrorVisible(true);
            }
        } else {
            console.warn("⚠️ Message vide. Rien n'a été envoyé.");
        }
    };

    const handleConversationClick = (huntId: number) => {
        setDiscussionId(huntId);
        setDiscussionClicked(true);
    };

    const handleBackClick = () => {
        setDiscussionId(null);
        setDiscussionClicked(false);
    };

    const renderItem = ({ item }: { item: LastMessage }) => (
        <TouchableOpacity
            className="flex-row items-center p-3 border-b border-gray-300"
            onPress={() => handleConversationClick(item.id)}
        >
            {item.role === "organizer" && <FontAwesome name="star" size={20} color="gold" />}
            <View className="flex-1 ml-3">
                <Text className="font-bold text-base text-black">
                    {item.message?.sender || i18n.t("Unknown sender")}
                </Text>
                <Text className="text-sm text-gray-600" numberOfLines={1} ellipsizeMode="tail">
                    {item.message?.text || i18n.t("No message")}
                </Text>
            </View>
            <Text className="text-sm text-gray-400 ml-2">
                {item.message?.date
                    ? new Date(item.message.date).toLocaleDateString()
                    : i18n.t("No date")}
            </Text>
        </TouchableOpacity>
    );

    const redirectWelcome = () => {
        router.push("/");
    };

    return (
        <>
            {!discussionClicked ? (
                <View className="flex-1 bg-gray-100 p-4">
                    <TouchableOpacity className="flex-row items-center mb-4" onPress={redirectWelcome}>
                        <FontAwesome name="arrow-left" size={20} color="black" />
                        <Text className="ml-2 text-lg font-bold text-black">{i18n.t("Back")}</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={lastMessages}
                        keyExtractor={(item) => item?.id.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <Text className="text-center text-gray-500 mt-10">{i18n.t("No conversations yet.")}</Text>
                        }
                    />
                </View>
            ) : (
                <View className="flex-1 bg-gray-100 p-4">
                    <TouchableOpacity className="flex-row items-center mb-4" onPress={handleBackClick}>
                        <FontAwesome name="arrow-left" size={20} color="black" />
                        <Text className="ml-2 text-lg font-bold text-black">{i18n.t("Back")}</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={[...messages].sort(
                            (a, b) =>
                                new Date(a.timestamp ?? 0).getTime() - new Date(b.timestamp ?? 0).getTime()
                        )}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View className="flex-row justify-between items-center mb-2">
                                <View className="flex-row items-center">
                                    {item.sender === organizerId && <FontAwesome name="star" size={16} color="gold" />}
                                    <Text
                                        className={`font-bold ${
                                            item.sender === user?.nickname ? "text-blue-500" : "text-gray-800"
                                        }`}
                                    >
                                        {item.sender === user?.nickname ? i18n.t("You") : item.sender}: {item.text}
                                    </Text>
                                </View>
                                <Text className="text-sm text-gray-500">
                                    {item.timestamp &&
                                        new Date(item.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                </Text>
                            </View>
                        )}
                    />

                    <TextInput
                        value={text}
                        onChangeText={setText}
                        placeholder={i18n.t("Write a message")}
                        className="border border-gray-300 rounded-lg p-3 bg-white mb-4"
                    />
                    <Button title={i18n.t("Send")} onPress={handleSend} />
                </View>
            )}
        </>
    );
};

export default Message;
