import React, { useEffect, useState } from "react";
import { FlatList, Text, TextInput, Button, View } from "react-native";
import { getDatabase, ref, push, onValue } from "firebase/database"; // Import des fonctions nécessaires
import { fetchTreasureHunt } from "@/services/MessageHunting";
import {UserConnected} from "@/services/UserService"; // Votre service existant pour récupérer les détails de la chasse

const Message = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const huntId = "huntId1"; // Identifiant de la chasse au trésor
    const senderId = "userId1"; // Remplacez par l'ID de l'utilisateur connecté

    const db = getDatabase(); // Initialise la base de données

    // Fonction pour écouter les messages en temps réel
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(await UserConnected());

                const messagesRef = ref(db, `treasureHunts/${huntId}/messages`);
                console.log("Référence des messages :", messagesRef);

                // Écoute des messages en temps réel
                const unsubscribe = onValue(messagesRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        console.log("Données des messages :", data);

                        const parsedMessages = Object.keys(data).map((key) => ({
                            id: key,
                            ...data[key],
                        }));
                        setMessages(parsedMessages);
                    } else {
                        setMessages([]);
                    }
                });

                // Retourner la fonction pour arrêter l'écoute
                return () => unsubscribe();
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchData();
    }, [db, huntId]);


    // Fonction pour envoyer un message
    const handleSend = async () => {
        if (text.trim()) {
            try {
                const message = {
                    senderId,
                    text,
                    timestamp: new Date().toISOString(),
                };
                const messagesRef = ref(db, `treasureHunts/${huntId}/messages`);
                await push(messagesRef, message); // Ajoute le message à la base de données
                setText(""); // Réinitialise le champ de texte
            } catch (error) {
                console.error("Erreur lors de l'envoi du message :", error);
            }
        }
    };

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text>
                        {item.senderId === senderId ? "Vous" : item.senderId}: {item.text}
                    </Text>
                )}
            />
            <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Écrire un message..."
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />
            <Button title="Envoyer" onPress={handleSend} />
        </View>
    );
};

export default Message;
