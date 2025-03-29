import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { getDatabase, set } from "firebase/database";
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
import {
  createPrivateDiscussion,
  getItemsMessageUser,
  getLastPrivateMessages,
  getMessage,
  searchUsersMessage,
  sendMessageGroup,
  sendPrivateMessage,
} from "@/services/MessageService";
import { getInfoUser } from "@/services/UsersService";
import ItemUsers from "@/type/feature/message/itemUsers";

import PreviewMessage from "@/components/message/PreviewMessage";
import ViewMessage from "@/components/message/ViewMessage";
import ViewExchangeItem from "@/components/message/ViewExchangeItem";
import { respondToExchange } from "@/services/ExchangeService";
import { getAllItem } from "@/services/ShopService";


const Message = () => {
  const { i18n } = useLanguage();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [text, setText] = useState<string>("");
  const [user, setUser] = useState<Users>();
  const [lastMessages, setLastMessage] = useState<LastMessage[]>([]);
  const [discussionClicked, setDiscussionClicked] = useState<boolean>(false);
  const [discussionId, setDiscussionId] = useState<number | null>(null);
  const [searchingNew, setSearchingNew] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<Users[]>([]);
  const [usersConnected, setUsersConnected] = useState<Users>();
  const [activeTab, setActiveTab] = useState<"group" | "private">("group");
  const [usersTalked, setUsersTalked] = useState<string>()
  const [showItemModal, setShowItemModal] = useState(false);
  const [allItems, setAllItems] = useState<ItemUsers[]>([]);
  const router = useRouter();
  const { setErrorMessage, setErrorVisible } = useErrors();
  const [itemUser, setItemUser] = useState<ItemUsers[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getInfoUser();
        setUsersConnected(users);
      } catch (error) {
        setErrorMessage(i18n.t("An error occurred while fetching data"));
        setErrorVisible(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (discussionId && activeTab === "group") {
          getMessage(discussionId.toString(), setMessages);
        }
      } catch (error) {
        setErrorMessage(i18n.t("An error occurred while fetching data"));
        setErrorVisible(true);
      }
    };
    fetchData();
  }, [discussionId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "group") {
          const huntings: LastMessageHunting = await getHuntingsForMessages();
          setUser(huntings.user);
          setLastMessage(huntings.lastMessage);
        } else {
          setAllItems(await getAllItem())
          await getLastPrivateMessages(usersConnected?.email || "", setLastMessage);
        }
      } catch (error) {
        setErrorMessage(i18n.t("An error occurred while fetching data"));
        setErrorVisible(true);
      }
    };
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const fetchFilteredUsers = async () => {
      if (searchQuery.trim() !== "") {
        const filtered = await searchUsersMessage(searchQuery);
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers([]);
      }
    };
    fetchFilteredUsers();
  }, [searchQuery]);

  const handleSend = async () => {
    if (text.trim()) {
      try {
        if (!discussionId && activeTab === "group") {
          setErrorMessage(i18n.t("No discussion selected"));
          setErrorVisible(true);
          return;
        }
        else if (activeTab === "group") {
          await sendMessageGroup(discussionId.toString(), user, text);
        } else {
          await sendPrivateMessage(usersConnected, usersTalked || "", text, setMessages, "");
        }
        setText("");
      } catch (error) {
        setErrorMessage(i18n.t("An error occurred while sending the message."));
        setErrorVisible(true);
      }
    } else {
      setErrorMessage(i18n.t("Message vide. Rien n'a été envoyé."));
      setErrorVisible(true);
    }
  };


  const handleConversationClick = async (huntId: string, receiver: string) => {
    setUsersTalked(receiver)
    if (activeTab === "group") {
      setDiscussionId(Number(huntId));
      setDiscussionClicked(true);
    } else {
      await createPrivateDiscussion(usersConnected?.email || "", receiver || "", setMessages, huntId)
      setItemUser(await getItemsMessageUser())
      setDiscussionClicked(true);
    }
  };

  const handleBackClick = () => {
    setDiscussionId(null);
    setDiscussionClicked(false);
  };

  const startNewDiscussion = async (selectedUser: Users) => {
    setUsersTalked(selectedUser.email)
    await createPrivateDiscussion(user?.email || "", selectedUser.email, setMessages, undefined)
    setItemUser(await getItemsMessageUser())
    setDiscussionClicked(true);
    setSearchingNew(false);
    setSearchQuery("");
  };

  const redirectWelcome = () => {
    router.push("/");
  };

  const cleanEmail = (email: string | undefined) =>
    (email ?? "").replace(/@/g, "-at-").replace(/\./g, "_");


  return (
    <>
      {!discussionClicked ? (
        <PreviewMessage
          lastMessages={lastMessages}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          setSearchingNew={setSearchingNew}
          searchingNew={searchingNew}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredUsers={filteredUsers}
          startNewDiscussion={startNewDiscussion}
          redirectWelcome={redirectWelcome}
          handleConversationClick={handleConversationClick}
        />
      ) : (
        <View className="flex-1 bg-gray-100 p-4">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={handleBackClick} className="w-1/4 items-start">
              <FontAwesome name="arrow-left" size={20} color="black" />
            </TouchableOpacity>

            <View className="w-2/4 items-center">
              <Text className="text-lg font-bold text-black truncate text-center">
                {usersTalked}
              </Text>
            </View>

            <View className="w-1/4" />
          </View>

          <ViewMessage  
            messages={messages}
            user={user}
            usersConnected={usersConnected}
            usersTalked={usersTalked || ""}
            respondToExchange={respondToExchange}
            cleanEmail={cleanEmail}
          />

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={i18n.t("Write a message")}
            className="border border-gray-300 rounded-lg p-3 bg-white mb-4"
          />

          {activeTab === "private" && (
            <ViewExchangeItem
              itemUser={itemUser}
              allItems={allItems}
              usersConnected={usersConnected}
              usersTalked={usersTalked || ""}
              i18n={{ t: (key: string) => key }}
              cleanEmail={cleanEmail}
              setText={setText}
              setErrorMessage={setErrorMessage}
              setErrorVisible={setErrorVisible}
              setShowItemModal={setShowItemModal}
              showItemModal={showItemModal}
              setMessages={setMessages}
            />
          )}

          <Button title={i18n.t("Send")} onPress={handleSend} />
        </View>
      )}
    </>
  );
};

export default Message;
