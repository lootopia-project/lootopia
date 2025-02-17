import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
export default function NotFoundScreen() {
  const router = useRouter();
  const { i18n } = useLanguage();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("404 - Page Not Found")}</Text>
      <Text style={styles.subtitle}>
        {i18n.t("Oops")}
      </Text>
      <TouchableOpacity
        style={styles.link}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.linkText}>{i18n.t("Go back to Home")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  link: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  linkText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
