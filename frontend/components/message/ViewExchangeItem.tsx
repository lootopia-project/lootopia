import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
} from "react-native";
import ItemExchangeCard from "./ItemExchangeCard";
import ViewExchangeItemProps from "@/type/feature/message/ViewExchangeItemProps";
import { getItemsMessageUser } from "@/services/MessageService";

const ViewExchangeItem: React.FC<ViewExchangeItemProps> = ({
  itemUser,
  allItems,
  usersConnected,
  usersTalked,
  i18n,
  cleanEmail,
  setText,
  setErrorMessage,
  setErrorVisible,
  setShowItemModal,
  showItemModal,
  setMessages,
  setItemUser
}) => {
  return (
    <>
      <TouchableOpacity
        style={styles.proposeButton}
        onPress={async () => { setShowItemModal(true); setItemUser(await getItemsMessageUser()); }}
      >
        <Text style={styles.proposeButtonText}>📦 {i18n.t("Propose a item")}</Text>
      </TouchableOpacity>

      <Modal
        visible={showItemModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowItemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              📦 {i18n.t("Your items to share")}
            </Text>

            <View style={{ flex: 1 }}>
              {usersConnected && usersTalked && (
                <ItemExchangeCard
                  itemUser={itemUser}
                  allItems={allItems}
                  usersConnected={usersConnected}
                  usersTalked={usersTalked}
                  i18n={i18n}
                  cleanEmail={cleanEmail}
                  setText={setText}
                  setErrorMessage={setErrorMessage}
                  setErrorVisible={setErrorVisible}
                  setShowItemModal={setShowItemModal}
                  setMessages={setMessages}
                />
              )}
            </View>


            <Button title={i18n.t("Close")} onPress={() => setShowItemModal(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  proposeButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  proposeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    width: "90%",
    padding: 20,
    borderRadius: 20,
    maxHeight: "85%",
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 20,
  },
});

export default ViewExchangeItem;
