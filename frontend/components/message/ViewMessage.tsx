import React, { useRef, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ViewMessageProps from "../../type/feature/message/ViewMessageProps";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { set } from "date-fns";
import { useErrors } from "@/hooks/providers/ErrorProvider";

const ViewMessage = (props: ViewMessageProps) => {
  const { i18n } = useLanguage();
  const {
    messages,
    user,
    usersConnected,
    usersTalked,
    respondToExchange,
    cleanEmail,
  } = props;

  const flatListRef = useRef<FlatList>(null);
  const { setErrorMessage, setErrorVisible } = useErrors();

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
          new Date(a.timestamp ?? 0).getTime() -
          new Date(b.timestamp ?? 0).getTime()
      )}
      keyExtractor={(item) => item.id || Math.random().toString()}
      renderItem={({ item }) => {
        const isMe = item.sender === user?.nickname;
        const isProposition = item.status !== "";

        const [email1, email2] = [
          cleanEmail(usersConnected?.email ?? ""),
          cleanEmail(usersTalked ?? ""),
        ].sort();

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
              style={[
                styles.messageBubble,
                {
                  backgroundColor: isMe ? "#3B82F6" : "#E5E7EB",
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  borderTopRightRadius: isMe ? 0 : 16,
                  borderTopLeftRadius: isMe ? 16 : 0,
                },
              ]}
            >
              <Text style={{ color: isMe ? "white" : "black", fontSize: 16 }}>
                {item.text}
              </Text>

              {isProposition && (
                <>
                  {item.status === "pending" && !isMe && (
                    <>
                      <View style={styles.actionContainer}>
                        <TouchableOpacity
                          style={[styles.button, styles.acceptButton]}
                          onPress={async () => {
                            const response = await respondToExchange(
                              discussionKey,
                              "accepted",
                              item.id
                            );
                            if (!response.success&& response.message) {
                              setErrorVisible(true);
                              setErrorMessage(response.message);
                            }
                          }}
                        >
                          <Text style={styles.buttonText}>
                            {i18n.t("I accept")}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.button, styles.rejectButton]}
                          onPress={() =>
                            respondToExchange(discussionKey, "rejected", item.id)
                          }
                        >
                          <Text style={styles.buttonText}>
                            {i18n.t("I refuse")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {item.status === "pending" && isMe && (
                    <View style={[styles.statusBubble, styles.pendingStatus]}>
                      <Text style={styles.statusText}>
                        ⏳ {i18n.t("Waiting for a response")}
                      </Text>
                    </View>
                  )}

                  {(item.status === "accepted" ||
                    item.status === "rejected") && (
                    <View
                      style={[
                        styles.statusBubble,
                        item.status === "accepted"
                          ? styles.acceptedStatus
                          : styles.rejectedStatus,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {item.status === "accepted"
                          ? i18n.t("✅Accepted")
                          : i18n.t("❌Refused")}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>

            {item.timestamp && (
              <Text style={styles.timeText}>
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: "80%",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
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
    backgroundColor: "#16a34a", // green
  },
  rejectButton: {
    backgroundColor: "#dc2626", // red
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  statusBubble: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  pendingStatus: {
    backgroundColor: "#FEF08A", // yellow-200
  },
  acceptedStatus: {
    backgroundColor: "#BBF7D0", // green-200
  },
  rejectedStatus: {
    backgroundColor: "#FECACA", // red-200
  },
  statusText: {
    fontWeight: "bold",
    color: "#1F2937",
    fontSize: 14,
  },
  timeText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});

export default ViewMessage;
