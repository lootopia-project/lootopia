import React, { useRef, useEffect } from "react";
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
          <View
            style={{
              width: "100%",
              paddingHorizontal: 8,
              marginBottom: 8,
              alignItems: isMe ? "flex-end" : "flex-start",
            }}
          >
            <View
              style={{
                backgroundColor: isMe ? "#3B82F6" : "#E5E7EB",
                alignSelf: isMe ? "flex-end" : "flex-start",
                paddingVertical: 12,
                paddingHorizontal: 16,
                maxWidth: "80%",
                borderTopRightRadius: isMe ? 0 : 16,
                borderTopLeftRadius: isMe ? 16 : 0,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Text className={`text-base ${isMe ? "text-white" : "text-black"}`}>
                {item.text}
              </Text>

              {/* Gestion des échanges */}
              {isProposition && (
                <>
                  {item.status === "pending" && !isMe && (
                    <View style={styles.actionContainer}>
                      <TouchableOpacity
                        style={[styles.button, styles.acceptButton]}
                        onPress={() => respondToExchange(discussionKey, "accepted", item.id)}
                      >
                        <Text style={styles.buttonText}>J'accepte</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, styles.rejectButton]}
                        onPress={() => respondToExchange(discussionKey, "rejected", item.id)}
                      >
                        <Text style={styles.buttonText}>Je refuse</Text>
                      </TouchableOpacity>
                    </View>
                  )}


                  {/* Statut : en attente (expéditeur) */}
                  {item.status === "pending" && isMe && (
                    <View className="mt-2 self-end">
                      <Text className="text-sm font-semibold px-2 py-1 rounded-md bg-yellow-200 text-yellow-800">
                        ⏳ En attente
                      </Text>
                    </View>
                  )}

                  {/* Statut : accepté ou refusé (tout le monde) */}
                  {(item.status === "accepted" || item.status === "rejected") && (
                    <View className="mt-2 self-end">
                      <Text
                        className={`text-sm font-semibold px-2 py-1 rounded-md ${item.status === "accepted"
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

            <Text className="text-xs text-gray-400 mt-1">
              {item.update &&
                new Date(item.update).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </Text>
          </View>
        )

      }}
    />
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  acceptButton: {
    backgroundColor: "#16a34a", // green-600
  },
  rejectButton: {
    backgroundColor: "#dc2626", // red-600
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ViewMessage;
