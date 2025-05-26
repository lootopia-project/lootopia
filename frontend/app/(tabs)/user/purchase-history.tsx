import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, ScrollView, StyleSheet } from "react-native";
import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { getLogHistories } from "@/services/ShopService";
import LogHistory from "@/type/feature/shop/log_history";
import { useRouter, Link } from "expo-router";
import { format } from "date-fns";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const PurchaseHistory = () => {
  const { setErrorMessage, setErrorVisible } = useErrors();
  const { i18n } = useLanguage();
  const router = useRouter();
  const [logHistory, setLogHistory] = useState<LogHistory[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getLogHistories();
        setLogHistory(response);
      } catch {
        setErrorMessage(i18n.t("An error occurred"));
        setErrorVisible(true);
      }
    })();
  }, [i18n, setErrorMessage, setErrorVisible]);

  return (
    <View style={styles.container} id="purchase-history">
      <View style={styles.header}>
        <Link href="/shop" asChild>
          <TouchableOpacity style={styles.backButton}>
            <ArrowLeftIcon size={24} color="#2E7D32" />
            <Text style={styles.backText}>{i18n.t("Back to shop")}</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>{i18n.t("Purchase History")}</Text>
      </View>

      <View style={styles.listWrapper}>
        <ScrollView contentContainerStyle={styles.listContent}>
          {logHistory.length > 0 ? (
            logHistory
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <Text style={styles.logText}>{log.log}</Text>
                  <Text style={styles.logDate}>
                    {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm")}
                  </Text>
                  {log.orderId && (
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() =>
                        router.push({
                          pathname: "/shop/order-detail",
                          params: { id: log.orderId },
                        })
                      }
                    >
                      <Text style={styles.detailsText}>
                        {i18n.t("View Details")}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
          ) : (
            <Text style={styles.emptyText}>
              {i18n.t("No purchase history available")}
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FFF0",
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2E7D32",
  },
  listWrapper: {
    flex: 1,                 // occupe tout l'espace restant
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 12,
  },
  logText: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  logDate: {
    fontSize: 12,
    color: "#888888",
    marginHorizontal: 12,
  },
  detailsButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  detailsText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#888888",
    fontSize: 16,
    marginTop: 40,
  },
});

export default PurchaseHistory;
