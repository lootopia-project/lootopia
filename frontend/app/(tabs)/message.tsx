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
  getLastPrivateMessages,
  getMessage,
  searchUsersMessage,
  sendMessageGroup,
  sendPrivateMessage,
} from "@/services/MessageService";
import { getInfoUser } from "@/services/UsersService";
import PrivateMessage from "@/type/feature/message/PrivateMessage";

const Message = () => {
  const { i18n } = useLanguage();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [text, setText] = useState<string>("");
  const [user, setUser] = useState<Users>();
  const [organizerId, setOrganizerId] = useState<string>("");
  const [lastMessages, setLastMessage] = useState<LastMessage[]>([]);
  const [discussionClicked, setDiscussionClicked] = useState<boolean>(false);
  const [discussionId, setDiscussionId] = useState<number | null>(null);
  const [searchingNew, setSearchingNew] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<Users[]>([]);
  const [usersConnected, setUsersConnected] = useState<Users>();
  const [activeTab, setActiveTab] = useState<"group" | "private">("group");
  const [usersTalked, setUsersTalked] = useState<Users>()

  const db = getDatabase();
  const router = useRouter();
  const { setErrorMessage, setErrorVisible } = useErrors();

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
        if (discussionId&&activeTab==="group") {
          const huntData = await fetchTreasureHunt(discussionId.toString());
          setOrganizerId(huntData.organizer);
          getMessage(discussionId.toString(), setMessages);
        }
      } catch (error) {
        setErrorMessage(i18n.t("An error occurred while fetching data"));
        setErrorVisible(true);
      }
    };
    fetchData();
  }, [db, discussionId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "group") {
            const huntings: LastMessageHunting = await getHuntingsForMessages();
            setUser(huntings.user);
            setLastMessage(huntings.lastMessage);
        }else{
           await getLastPrivateMessages(usersConnected?.email || "",setLastMessage);
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
        if (!discussionId&&activeTab==="group") {
          setErrorMessage(i18n.t("No discussion selected"));
          setErrorVisible(true);
          return;
        }
        if (activeTab==="group"){
        await sendMessageGroup(discussionId.toString(), user, text);
      }else{
        await sendPrivateMessage(usersConnected,usersTalked?.email || "", text,setMessages);
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

  const handleConversationClick = async (huntId: string) => {
    console.log(huntId)
    if (activeTab === "group") {
      setDiscussionId(Number(huntId));
      setDiscussionClicked(true);
    } else {
        await createPrivateDiscussion (usersConnected?.email || "", usersTalked?.email || "", setMessages,huntId)
        setDiscussionClicked(true);
    }
  };

  const handleBackClick = () => {
    setDiscussionId(null);
    setDiscussionClicked(false);
  };

  const startNewDiscussion = async (selectedUser: Users) => {
    await createPrivateDiscussion(user?.email || "", selectedUser.email, setMessages,undefined)
    setUsersTalked(selectedUser)
    setDiscussionClicked(true);
    setSearchingNew(false);
    setSearchQuery("");
  };

  const redirectWelcome = () => {
    router.push("/");
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

  console.log(lastMessages)

  return (
    <>
      {!discussionClicked ? (
        <View className="flex-1 bg-gray-100 p-4">
          <TouchableOpacity className="flex-row items-center mb-4" onPress={redirectWelcome}>
            <FontAwesome name="arrow-left" size={20} color="black" />
            <Text className="ml-2 text-lg font-bold text-black">{i18n.t("Back")}</Text>
          </TouchableOpacity>

          <View className="flex-row justify-around mb-4">
            <TouchableOpacity onPress={() => setActiveTab("group")}> 
              <Text className={`text-lg font-bold ${activeTab === "group" ? "text-blue-600" : "text-gray-500"}`}>
                {i18n.t("Group messages")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("private")}> 
              <Text className={`text-lg font-bold ${activeTab === "private" ? "text-blue-600" : "text-gray-500"}`}>
                {i18n.t("Private messages")}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={lastMessages.filter(msg =>
              activeTab === "group" ? msg.type === "group" : msg.type === "private"
            )}
            keyExtractor={(item) => item?.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text className="text-center text-gray-500 mt-10">{i18n.t("No conversations")}</Text>
            }
          />

          {activeTab === "private" && (
            <TouchableOpacity
              className="bg-blue-500 py-3 rounded-lg mt-4"
              onPress={() => setSearchingNew(true)}
            >
              <Text className="text-white text-center font-bold">+ {i18n.t("New Message")}</Text>
            </TouchableOpacity>
          )}

          <Modal
            visible={searchingNew}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setSearchingNew(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="w-11/12 bg-white p-6 rounded-xl shadow-md">
                <Text className="text-lg font-bold mb-2">{i18n.t("New message")}</Text>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search user..."
                  className="border border-gray-300 rounded-lg p-3 mb-3"
                />
                <FlatList
                  data={filteredUsers}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="flex-row items-center p-2 border-b border-gray-200"
                      onPress={() => startNewDiscussion(item)}
                    >
                      <Image
                        source={{ uri: item.img || "https://example.com/default-avatar.png" }}
                        className="w-10 h-10 rounded-full mr-3"
                        resizeMode="cover"
                      />
                      <Text className="text-black text-base">{item.nickname}</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text className="text-center text-gray-500">{i18n.t("No users found")}</Text>
                  }
                />
                <Button title="Fermer" onPress={() => setSearchingNew(false)} />
              </View>
            </View>
          </Modal>
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
            keyExtractor={(item) => item.id || ""}
            renderItem={({ item }) => (
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  {item.sender === organizerId && (
                    <FontAwesome name="star" size={16} color="gold" />
                  )}
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
