import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { getDatabase, onValue, push, ref } from "firebase/database";
import { fetchTreasureHunt } from "@/services/MessageHunting";
import { UserConnected } from "@/services/UserService";
import { FontAwesome } from "@expo/vector-icons";
import { getHuntingsForMessages } from "@/services/HuntingService";
import Users from "@/type/feature/auth/users";
import Messages from "@/type/feature/message/message";
import { useRouter } from "expo-router";
import LastMessage from "@/type/feature/message/last_message";
import {useLanguage} from "@/hooks/providers/LanguageProvider";

const Message = () => {
    const {i18n} = useLanguage();
    const [messages, setMessages] = useState<Messages[]>([]);
    const [text, setText] = useState<string>("");
    const [user, setUser] = useState<Users>();
    const [organizerId, setOrganizerId] = useState<string>("");
    const [lastMessages, setLastMessage] = useState<LastMessage[]>([]);
    const [discussionClicked, setDiscussionClicked] = useState<boolean>(false);
    const [discussionId, setDiscussionId] = useState<number | null>(null);
    const db = getDatabase();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userConnected = await UserConnected();
                setUser(userConnected);

                const huntings = await getHuntingsForMessages();
                setLastMessage(huntings);

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
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchData().catch((error) =>
            console.error("Erreur lors de l'exécution de fetchData :", error)
        );
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
                console.error("Erreur lors de l'envoi du message :", error);
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
        <TouchableOpacity style={styles.listItem} onPress={() => handleConversationClick(item.id)}>
            {item.role === "organizer" && <FontAwesome name="star" size={20} color="gold" />}
            <View style={styles.listItemText}>
                <Text style={styles.listItemSender}>{item.lastMessage?.sender}</Text>
                <Text style={styles.listItemMessage} numberOfLines={1} ellipsizeMode="tail">
                    {item.lastMessage?.text}
                </Text>
            </View>
            <Text style={styles.listItemDate}>
                {item.lastMessage?.date && new Date(item.lastMessage.date).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    );

    const redirectWelcome = () => {
        router.push("/");
    };

    return (
        <>
            {!discussionClicked ? (
                <View style={styles.container}>
                    <TouchableOpacity style={styles.backButton} onPress={redirectWelcome}>
                        <FontAwesome name="arrow-left" size={20} color="black" />
                        <Text style={styles.backButtonText}>{i18n.t("Back")}</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={lastMessages}
                        keyExtractor={(item) => item?.id.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <Text style={styles.emptyMessage}>{i18n.t("No conversations yet.")}</Text>
                        }
                    />
                </View>
            ) : (
                <View style={styles.messageContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackClick}>
                        <FontAwesome name="arrow-left" size={20} color="black" />
                        <Text style={styles.backButtonText}>{i18n.t("Back")}</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={[...messages].sort(
                            (a, b) =>
                                new Date(a.timestamp ?? 0).getTime() - new Date(b.timestamp ?? 0).getTime()
                        )}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.messageItem}>
                                <View style={styles.messageItemSender}>
                                    {item.sender === organizerId && <FontAwesome name="star" size={16} color="gold" />}
                                    <Text
                                        style={
                                            item.sender === user?.nickname ? styles.messageTextSelf : styles.messageTextOther
                                        }
                                    >
                                        {item.sender === user?.nickname ? i18n.t("You") : item.sender}: {item.text}
                                    </Text>
                                </View>
                                <Text style={styles.messageTimestamp}>
                                    {item.timestamp && new Date(item.timestamp).toLocaleTimeString([], {
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
                        style={styles.input}
                    />
                    <Button title={i18n.t("Send")} onPress={handleSend} />
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 16,
        paddingTop: 40, // Ajout de padding en haut pour espacement sur mobile
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        paddingVertical: 10, // Espacement vertical pour rendre le bouton plus accessible
    },
    backButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8, // Espacement entre l'icône et le texte
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
    },
    listItemText: {
        flex: 1,
    },
    listItemSender: {
        fontSize: 16,
        fontWeight: "bold",
    },
    listItemMessage: {
        color: "#6b7280",
    },
    listItemDate: {
        color: "#9ca3af",
        fontSize: 14,
        marginLeft: 8,
    },
    messageContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40, // Assurez-vous que le haut est également espacé ici
        backgroundColor: "#f3f4f6",
    },
    messageItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    messageItemSender: {
        flexDirection: "row",
        alignItems: "center",
    },
    messageTextSelf: {
        color: "#2563eb",
        fontWeight: "bold",
    },
    messageTextOther: {
        color: "#374151",
    },
    messageTimestamp: {
        color: "#9ca3af",
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
        backgroundColor: "white",
    },
    emptyMessage: {
        textAlign: "center",
        color: "#6b7280",
        marginTop: 10,
    },
});


export default Message;
