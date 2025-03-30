import AXIOS_ERROR from "@/type/request/axios_error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { get, getDatabase, onValue, push, ref, update } from "firebase/database";
import {getConfig} from "@/services/csrfService";

const nameNoeud= process.env.EXPO_PUBLIC_NAME_NOEUD_FIREBASE as string;
const API_URL = process.env.EXPO_PUBLIC_API_URL as string

export const proposeExchange = async (discussionKey: string, exchangeData: any) => {
    const db = getDatabase();
    const chatPath = `${nameNoeud}/private_chat/${discussionKey}/exchanges`
    const exchangeRef = ref(db, chatPath);
    await push(exchangeRef, {
        ...exchangeData,
        status: "pending",
        createdAt: new Date().toISOString(),
    });

  };
  
  export const respondToExchange = async (
    discussionKey: string,
    status: "accepted" | "rejected",
    messageId?: string
  ) => {
    const db = getDatabase();
  
    const exchangePath = `${nameNoeud}/private_chat/${discussionKey}/exchanges`;
    const exchangeRef = ref(db, exchangePath);

    const exchangeSnapshot = await get(exchangeRef);

    if (!exchangeSnapshot.exists()) {
      console.warn("❌ Aucun échange trouvé pour cette discussion.");
      return;
    }
  
    const exchanges = exchangeSnapshot.val();
  
    const pendingKey = Object.keys(exchanges).find(
      (key) => exchanges[key]?.messageId === messageId
    );
  
    if (!pendingKey) {
      console.warn("❌ Aucun échange en attente trouvé.");
      return;
    }

    if (messageId) {
      const messageRef = ref(
        db,
        `${nameNoeud}/private_chat/${discussionKey}/messages/${messageId}`
      );
      if (status === "accepted") {
        const exchange = exchanges[pendingKey];
        const verification = await verifyReceiverItems(exchange);
      
        if (verification.success) {
          await update(messageRef, { status: "accepted" });
          exchangeItem(exchange);
          return {success: false, message: verification.message};
        }
        else{
          await update(messageRef, { status: "rejected" }); 
          return {success: true, message: verification.message};
        }
      }else{
        await update(messageRef, { status: "rejected" }); 
        return {success: false, message: ""};
      }
    }
  };


  
  export const exchangeItem= async (exchangeData: any) => {
    const config = await getConfig();
    try {
      const response = await axios.post(`${API_URL}/users/exchangeItemUsers`, exchangeData, config);
      return response.data;
    } catch (err: unknown) {
      if ((err as AXIOS_ERROR).message) {
        throw new Error("Error connecting");
      } else {
        throw new Error("Error connecting to server");
      }
    }
  }
  
  export const listenToExchanges = (chatId: string, callback: (exchangeList: any[]) => void) => {
    const db = getDatabase();
    const exchangesRef = ref(db, `private_chat/${chatId}/exchanges`);
    onValue(exchangesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.values(data);
        callback(list);
      } else {
        callback([]);
      }
    });
  };

  export const verifyReceiverItems = async (exchangeData: any) => {
    const config = await getConfig();
    try {
      const response = await axios.post(`${API_URL}/items/verifyReceiverItems`, exchangeData, config);
      return response.data; 
    } catch (err) {
      return { success: false, error: "Server error" };
    }
  };
  