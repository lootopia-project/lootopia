import { getDatabase, onValue, push, ref } from "firebase/database";
import Messages from "@/type/feature/message/message";
import Users from "@/type/feature/auth/users";
const nameNoeud= process.env.EXPO_PUBLIC_NAME_NOEUD_FIREBASE as string;
const db = getDatabase();


export const getMessage = (discussionId: string, setMessages: (messages: Messages[]) => void) => {

    const messagesRef = ref(db, `${nameNoeud}/${discussionId}/messages`);
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

export const sendMessage = async (discussionId: string, user: Users | undefined, text: string) => {
    const message = {
        sender: user?.nickname || "Anonyme",
        text: text.trim(),
        timestamp: new Date().toISOString(),
    };

    const messagesRef = ref(db, `treasureHunts/${discussionId}/messages`);
    await push(messagesRef, message);
}


