import React, { useEffect, useState } from "react";
import { FlatList, Text, TextInput, Button, View } from "react-native";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { fetchTreasureHunt } from "@/services/MessageHunting";
import { UserConnected } from "@/services/UserService";
import { FontAwesome } from "@expo/vector-icons";
import { getHuntingsForMessages } from "@/services/HuntingService"; // Importer des icônes

const Message = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const db = getDatabase(); // Initialise la base de données
    const [user, setUser] = useState(null); // Utilisateur connecté
    const [organizerId, setOrganizerId] = useState(""); // ID de l'organisateur
    const [lastMessage, setLastMessage] = useState([]); // Dernier message

    // Écoute en temps réel et récupération des détails
    useEffect(() => {
        const fetchData = async () => {
            console.log("fetchData");
            try {
                console.log("try");
                const userConnected = await UserConnected();
                setLastMessage(await getHuntingsForMessages());
                console.log("afterr userConnected");
                setUser(userConnected);
                console.log(userConnected);

                const huntData = await fetchTreasureHunt("1");
                setOrganizerId(huntData.organizer);

                const messagesRef = ref(db, `treasureHunts/${"1"}/messages`);

                // Écoute des messages en temps réel
                const unsubscribe = onValue(messagesRef, (snapshot) => {
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

                return unsubscribe;
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        // Appeler fetchData dans une fonction interne
        fetchData().catch((error) =>
            console.error("Erreur lors de l'exécution de fetchData :", error)
        );
    }, [db]);

    console.log(lastMessage);

    // Fonction pour envoyer un message
    const handleSend = async () => {
        if (text.trim()) {
            try {
                const message = {
                    sender: user?.nickname,
                    text,
                    timestamp: new Date().toISOString(),
                };

                const messagesRef = ref(db, `treasureHunts/${"1"}/messages`);
                await push(messagesRef, message);

                setText("");
            } catch (error) {
                console.error("Erreur lors de l'envoi du message :", error);
            }
        }
    };

    return (
        <View className="flex-1 p-4 bg-gray-100">
            {/* Liste des messages */}
            <FlatList
                data={[...messages].sort(
                    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                )}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="flex-row items-center space-x-2 mb-2">
                        {/* Afficher la couronne si l'utilisateur est l'organisateur */}
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
                )}
                className="mb-4"
            />

            <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Écrire un message..."
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4 bg-white"
            />

            {/* Bouton envoyer */}
            <Button title="Envoyer" onPress={handleSend} />
        </View>
    );
};

export default Message;
