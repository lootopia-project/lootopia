import { get, getDatabase, onValue, push, ref, set, update } from "firebase/database";
import Messages from "@/type/feature/message/message";
import Users from "@/type/feature/auth/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AXIOS_ERROR from "@/type/request/axios_error";
const nameNoeud= process.env.EXPO_PUBLIC_NAME_NOEUD_FIREBASE as string;
const db = getDatabase();
const API_URL = process.env.EXPO_PUBLIC_API_URL as string
import { database } from "@/services/firebase"
import LastMessage from "@/type/feature/message/LastMessage";



export const getMessage = (discussionId: string, setMessages: (messages: Messages[]) => void) => {

    const messagesRef = ref(db, `${nameNoeud}/hunting_chat/${discussionId}/messages`);
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

export const sendMessageGroup = async (discussionId: string, user: Users | undefined, text: string) => {
    const message = {
        sender: user?.nickname || "Anonyme",
        text: text.trim(),
        timestamp: new Date().toISOString(),
    };

    const messagesRef = ref(db, `${nameNoeud}/hunting_chat/${discussionId}/messages`);
    await push(messagesRef, message);
}

export const sendPrivateMessage = async (me:Users|undefined,otherEmail: string, text: string, setMessages: (messages: Messages[]) => void,type:string) => {
    if (!me) {
        throw new Error("Vous devez être connecté pour envoyer un message.")
    }
    const encodedEmail1 = encodeEmail(me.email)
    const encodedEmail2 = encodeEmail(otherEmail)
    
    const [user1, user2] = [encodedEmail1, encodedEmail2].sort()
    const chatPath = `${nameNoeud}/private_chat/${user1}-${user2}/messages`
    const message = {
        sender: me?.nickname || "Anonyme",
        text: text.trim(),
        date: new Date().toISOString(),
        status:type
    };
    const messagesRef = ref(db, chatPath);
    const keyMessage=(await push(messagesRef, message)).key;

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
    console.log("service "+messagesRef)
    return keyMessage
}

const encodeEmail = (email: string) =>
    email.replace(/\./g, "_").replace(/@/g, "-at-")

export const createPrivateDiscussion = async (
    myEmail: string,
    otherEmail: string,
    setMessages: (messages: Messages[]) => void,
    huntId: string | undefined
  ) => {
    try {
      const encodedEmail1 = encodeEmail(myEmail);
      const encodedEmail2 = encodeEmail(otherEmail);
  
      const [user1, user2] = [encodedEmail1, encodedEmail2].sort();
      let chatPath = "";
      if (!huntId) {
        chatPath = `${nameNoeud}/private_chat/${user1}-${user2}`;
      } else {
        chatPath = `${nameNoeud}/private_chat/${huntId}`;
      }
  
      const discussionRef = ref(db, chatPath);
      const snapshot = await get(discussionRef);
  
      if (!snapshot.exists()) {
        const [email1, email2] = [myEmail, otherEmail].sort();
        await set(discussionRef, {
          participants: [email1, email2],
          messages: {
            0: {
              sender: otherEmail,
              text: "Bienvenue dans la discussion privée !",
              date: new Date().toISOString(),
            },
          },
          type: "private",
        });
      } else {
        const messagesRef = ref(db, `${chatPath}/messages`);
        const exchangesRef = ref(db, `${chatPath}/exchanges`);
  
        // On récupère les échanges en parallèle
        const exchangesSnap = await get(exchangesRef);
        let exchanges: any[] = [];
  
        if (exchangesSnap.exists()) {
          const raw = exchangesSnap.val();
          exchanges = Object.values(raw);
        }
  
        // On écoute les messages et on ajoute le status s’il y a un échange correspondant
        onValue(messagesRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const parsedMessages: Messages[] = Object.keys(data).map((key) => {
              const msg = {
                id: key,
                ...data[key],
              };
  
              // Cherche un échange avec la même date (à la seconde près)
              const matchingExchange = exchanges.find(
                (ex) => ex.createdAt && ex.createdAt === msg.date
              );
  
              // Si trouvé, on ajoute le status
              if (matchingExchange) {
                (msg as any).status = matchingExchange.status;
              }
  
              return msg;
            });
            setMessages(parsedMessages);
          } else {
            setMessages([]);
          }
        });
      }
  
      return chatPath;
    } catch (error) {
      console.error("❌ Erreur lors de la création de la discussion :", error);
      throw error;
    }
  };
  


export const searchUsersMessage = async (search: string) => {

    const token = await AsyncStorage.getItem("token");
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? token : "",
        },
        withCredentials: true,
    };

    try {
        const response = await axios.get(`${API_URL}/users/searchUsers`, {
            params: { search, }, ...config,
        });

        return response.data as Users[];
    } catch (err: unknown) {
        if ((err as AXIOS_ERROR).message) {
            throw new Error("Error connecting");
        } else {
            throw new Error("Error connecting to server");
        }
    }
}

export const getLastPrivateMessages = (myEmail: string, setLastMessages: (messages: LastMessage[]) => void) => {
    const encodedEmail = encodeEmail(myEmail)
    const chatPath = `${nameNoeud}/private_chat`
    const messagesRef = ref(database, chatPath)
    onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const filteredMessages: LastMessage[] = Object.entries(data)
                .filter(([chatId]) => chatId.includes(encodedEmail))
                .map(([chatId, chatData]: any) => {
                    const allMessages = chatData.messages || {};
                    const messagesArray = Object.values(allMessages) as any[];
                    let participants = chatData.participants;

                    const encodeEmailForFirebase = (email: string) =>
                    email.replace(/@/g, '-at-').replace(/\./g, '_');

                    const encodedUserEmail = encodeEmailForFirebase(myEmail);
                    
                    participants = participants?.filter((participant: string) => participant !== encodedUserEmail)[0];
                    const sorted = messagesArray.sort(
                        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                      );
                      const message = sorted[0];
                    return {
                        id: chatId,
                        ...{ message , type: chatData.type,receiver:participants},
                    };
                });
            setLastMessages(filteredMessages);
        } else {
            setLastMessages([]);
        }
    });
}

