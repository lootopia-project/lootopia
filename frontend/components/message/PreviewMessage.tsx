import { useLanguage } from "@/hooks/providers/LanguageProvider";
import Users from "@/type/feature/auth/users";
import LastMessage from "@/type/feature/message/LastMessage";
import { FontAwesome } from "@expo/vector-icons"
import { TouchableOpacity, View, Text, FlatList, Modal, TextInput, Image, Button } from "react-native"

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
    handleConversationClick
}) => {
      const { i18n } = useLanguage();

        const renderItem = ({ item }: { item: LastMessage }) => (
          <TouchableOpacity
            className="flex-row items-center p-3 border-b border-gray-300"
            onPress={() => handleConversationClick(String(item.id), item.receiver)}
          >
            {item.role === "organizer" && <FontAwesome name="star" size={20} color="gold" />}
            <View className="flex-1 ml-3">
              <Text className="font-bold text-base text-black">
                {activeTab === "private" ? item.receiver : item.message?.sender}
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
      
    
    return (
        <View className="flex-1 bg-gray-100 p-4">
        <TouchableOpacity className="flex-row items-center mb-4" onPress={redirectWelcome}>
          <FontAwesome name="arrow-left" size={20} color="black" />
          <Text className="ml-2 text-lg font-bold text-black">{i18n.t("Back")}</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center space-x-4 mb-4">
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
              <Text className="text-lg font-bold mb-2">{i18n.t("New Message")}</Text>
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
                      style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
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
    )
}

export default PreviewMessage