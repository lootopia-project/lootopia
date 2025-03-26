import React, { useRef, useEffect } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import ViewMessageProps from "../../type/feature/message/ViewMessageProps";

const ViewMessage = (props: ViewMessageProps) => {
  const {
    messages,
    user,
    usersConnected,
    usersTalked,
    respondToExchange,
    cleanEmail,
  } = props;

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: false }); 
      }
    }, 100); 
  
    return () => clearTimeout(timeout); 
  }, []);

  return (
    <FlatList
      ref={flatListRef}
      data={[...messages].sort(
        (a, b) =>
          new Date(a.timestamp ?? 0).getTime() - new Date(b.timestamp ?? 0).getTime()
      )}
      keyExtractor={(item) => item.id || Math.random().toString()}
      renderItem={({ item }) => {
        const isMe = item.sender === user?.nickname;
        const isProposition = item.status !== "";
        const hasStatus =
          item.status === "accepted" || item.status === "rejected" || item.status === "pending";

        const [email1, email2] = [cleanEmail(usersConnected?.email ?? ""), cleanEmail(usersTalked ?? "")].sort();
        const discussionKey = `${email1}-${email2}`;

        return (
          <View className={`flex w-full mb-2 ${isMe ? "items-end" : "items-start"}`}>
            <View
              className={`rounded-xl px-4 py-2 max-w-[80%] ${isMe ? "bg-blue-500" : "bg-gray-300"}`}
            >
              <Text className={`text-sm ${isMe ? "text-white" : "text-black"}`}>
                {item.text}
              </Text>

              {isProposition && (
                <>
                  {item.status === "pending" && !isMe && (
                    <View className="flex-row mt-2 justify-end space-x-2">
                      <TouchableOpacity
                        className="bg-green-600 px-3 py-1 rounded-md"
                        onPress={() => respondToExchange(discussionKey, "accepted", item.id)}
                      >
                        <Text className="text-white text-sm">J'accepte</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-red-600 px-3 py-1 rounded-md"
                        onPress={() => respondToExchange(discussionKey, "rejected", item.id)}
                      >
                        <Text className="text-white text-sm">Je refuse</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {item.status === "pending" && isMe && (
                    <View className="mt-2 self-end">
                      <Text className="text-sm font-semibold px-2 py-1 rounded-md bg-yellow-200 text-yellow-800">
                        ⏳ En attente
                      </Text>
                    </View>
                  )}

                  {(item.status === "accepted" || item.status === "rejected") && (
                    <View className="mt-2 self-end">
                      <Text
                        className={`text-sm font-semibold px-2 py-1 rounded-md ${
                          item.status === "accepted"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {item.status === "accepted" ? "✅ Accepté" : "❌ Refusé"}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
            <Text className="text-xs text-gray-500 mt-1">
              {item.timestamp &&
                new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </Text>
          </View>
        );
      }}
    />
  );
};

export default ViewMessage;
