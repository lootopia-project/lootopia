import { useLanguage } from "@/hooks/providers/LanguageProvider";
import Users from "@/type/feature/auth/users";
import LastMessage from "@/type/feature/message/LastMessage";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  Image,
} from "react-native";

interface PreviewMessageProps {
  lastMessages: LastMessage[];
  setActiveTab: (tab: "group" | "private") => void;
  activeTab: "group" | "private";
  setSearchingNew: (val: boolean) => void;
  searchingNew: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filteredUsers: Users[];
  startNewDiscussion: (user: Users) => void;
  redirectWelcome: () => void;
  handleConversationClick: (huntId: string, receiver: string) => void;
}

const PreviewMessage: React.FC<PreviewMessageProps> = ({
  lastMessages,
  setActiveTab,
  activeTab,
  setSearchingNew,
  searchingNew,
  searchQuery,
  setSearchQuery,
  filteredUsers,
  startNewDiscussion,
  redirectWelcome,
  handleConversationClick,
}) => {
  const { i18n } = useLanguage();
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);

  const filteredMessages = lastMessages.filter((msg) =>
    activeTab === "group" ? msg.type === "group" : msg.type === "private"
  );

  const isLoading =
    lastMessages.length > 0 &&
    filteredMessages.length === 0 &&
    (activeTab === "private" || activeTab === "group");

  const renderItem = ({ item }: { item: LastMessage }) => (
    <TouchableOpacity
      className="flex-row items-center p-3 border-b border-gray-300"
      onPress={() => handleConversationClick(String(item.id), item.receiver)}
    >
      {item.role === "organizer" && (
        <FontAwesome name="star" size={20} color="gold" />
      )}
      <View className="flex-1 ml-3">
        <Text className="font-bold text-base text-black">
          {activeTab === "private" ? item.receiver : item.message?.sender}
        </Text>
        <Text
          className="text-sm text-gray-600"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
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

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={redirectWelcome}
      >
        <FontAwesome name="arrow-left" size={20} color="black" />
        <Text className="ml-2 text-lg font-bold text-black">
          {i18n.t("Back")}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center space-x-4 mb-4">
        <TouchableOpacity onPress={() => setActiveTab("group")}>
          <Text
            className={`text-lg font-bold ${activeTab === "group" ? "text-blue-600" : "text-gray-500"}`}
          >
            {i18n.t("Group messages")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("private")}>
          <Text
            className={`text-lg font-bold ${activeTab === "private" ? "text-blue-600" : "text-gray-500"}`}
          >
            {i18n.t("Private messages")}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text className="text-center text-gray-500 mt-10">
          {i18n.t("Loading conversations")}
        </Text>
      ) : filteredMessages.length === 0 ? (
        <Text className="text-center text-gray-500 mt-10">
          {i18n.t("No conversations")}
        </Text>
      ) : (
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item?.id.toString()}
          renderItem={renderItem}
        />
      )}

      {activeTab === "private" && (
        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-lg mt-4"
          onPress={() => setSearchingNew(true)}
        >
          <Text className="text-white text-center font-bold">
            + {i18n.t("New Message")}
          </Text>
        </TouchableOpacity>
      )}

<Modal
  visible={searchingNew}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setSearchingNew(false)}
>
  <View className="flex-1 justify-center items-center bg-black/40 px-4">
    <View className="w-full max-w-md bg-white rounded-2xl p-5 shadow-lg">

      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">{i18n.t("New Message")}</Text>
        <TouchableOpacity onPress={() => setSearchingNew(false)}>
          <Text className="text-xl text-gray-500 font-bold">✕</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={i18n.t("Search user")}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
      />

      {/* List */}
      <FlatList
        data={filteredUsers}
        style={{ maxHeight: 300 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center p-2 border-b border-gray-200"
            onPress={() => startNewDiscussion(item)}
          >
            <Image
              source={{ uri: item.img || "https://example.com/default-avatar.png" }}
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
              resizeMode="cover"
            />
            <Text className="text-black text-base">{item.nickname}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500">
            {i18n.t("No users found")}
          </Text>
        }
      />

      {/* Close button */}
      <TouchableOpacity
        className="bg-blue-500 rounded-lg py-3 mt-4"
        onPress={() => setSearchingNew(false)}
      >
        <Text className="text-white text-center font-bold">{i18n.t("Close")}</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default PreviewMessage;
