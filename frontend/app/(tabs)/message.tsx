import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getDatabase, onValue, push, ref } from "firebase/database";
import { fetchTreasureHunt } from "@/services/MessageHunting";
import { UserConnected } from "@/services/UserService";
import { FontAwesome } from "@expo/vector-icons";
import { getHuntingsForMessages } from "@/services/HuntingService";

const Message = () => {
    const [messages, setMessages] = useState([]); // Messages de la conversation
    const [text, setText] = useState(""); // Contenu du message
    const [user, setUser] = useState(null); // Utilisateur connecté
    const [organizerId, setOrganizerId] = useState(""); // ID de l'organisateur
    const [lastMessages, setLastMessage] = useState([]); // Derniers messages de chaque conversation
    const [discussionClicked, setDiscussionClicked] = useState(false); // Gestion de la vue
    const [discussionId, setDiscussionId] = useState(null); // ID de la discussion active
    const db = getDatabase(); // Firebase Database

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userConnected = await UserConnected();
                setUser(userConnected);

                const huntings = await getHuntingsForMessages();
                setLastMessage(huntings);

                if (discussionId) {
                    const huntData = await fetchTreasureHunt(discussionId);
                    setOrganizerId(huntData.organizer);

                    const messagesRef = ref(db, `treasureHunts/${discussionId}/messages`);
                    onValue(messagesRef, (snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            const parsedMessages = Object.keys(data).map((key) => ({
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
    console.log(messages)

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
                setText(""); // Réinitialiser l'entrée
                console.log("✅ Message envoyé :", message);
            } catch (error) {
                console.error("Erreur lors de l'envoi du message :", error);
            }
        } else {
            console.warn("⚠️ Message vide. Rien n'a été envoyé.");
        }
    };

    const handleConversationClick = (huntId) => {
        console.log("Conversation sélectionnée avec l'ID :", huntId);
        setDiscussionId(huntId); // Mettre à jour l'ID de la discussion
        setDiscussionClicked(true); // Activer la vue de la discussion
    };

    const handleBackClick = () => {
        setDiscussionId(null);
        setDiscussionClicked(false); // Retour à la vue des conversations
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            className="flex-row items-center p-3 border-b border-gray-200"
            onPress={() => handleConversationClick(item.id)}
        >
            {item.role === "organizer" && (
                <FontAwesome name="crown" size={20} color="gold" className="mr-3" />
            )}
            <View className="flex-1">
                <Text className="font-bold text-lg">{item.lastMessage?.sender}</Text>
                <Text className="text-gray-600" numberOfLines={1} ellipsizeMode="tail">
                    {item.lastMessage?.text}
                </Text>
            </View>
            <Text className="text-gray-400 text-sm ml-2">
                {new Date(item.lastMessage?.date).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    );

    return (
        <>
            {!discussionClicked ? (
                <View className="flex-1 bg-gray-100">
                    <FlatList
                        data={lastMessages}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <Text className="text-center text-gray-600 mt-10">
                                Aucune conversation pour l'instant.
                            </Text>
                        }
                    />
                </View>
            ) : (
                <View className="flex-1 p-4 bg-gray-100">
                    <TouchableOpacity
                        onPress={handleBackClick}
                        className="mb-4 flex-row items-center space-x-2"
                    >
                        <FontAwesome name="arrow-left" size={20} color="black" />
                        <Text className="text-lg font-bold">Retour</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={[...messages].sort(
                            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                        )}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View className="flex-row justify-between items-center mb-2">
                                <View className="flex-row items-center space-x-2">
                                    {/* Affiche une couronne si l'utilisateur est l'organisateur */}
                                    {item.senderId === organizerId && (
                                        <FontAwesome name="crown" size={16} color="gold" />
                                    )}
                                    <Text
                                        className={`text-base ${
                                            item.sender === user?.nickname
                                                ? "text-blue-600 font-bold"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {item.sender === user?.nickname ? "Vous" : item.sender}: {item.text}
                                    </Text>
                                </View>
                                <Text className="text-gray-400 text-sm">
                                    {new Date(item.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>
                            </View>
                        )}
                        className="mb-4"
                    />

                    <TextInput
                        value={text}
                        onChangeText={setText}
                        placeholder="Écrire un message..."
                        className="border border-gray-300 rounded-lg px-4 py-2 mb-4 bg-white"
                    />
                    <Button title="Envoyer" onPress={handleSend} />
                </View>

            )}
        </>
    );
};

export default Message;
