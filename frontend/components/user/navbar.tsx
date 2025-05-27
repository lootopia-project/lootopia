import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useLanguage } from "@/hooks/providers/LanguageProvider";

const Navbar = () => {
  const { i18n } = useLanguage();
  return (
    <View style={styles.navContainer}>
      <Link href="/user/edit" asChild>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>{i18n.t("Edit User")}</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/user/2fa" asChild>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>{i18n.t("Multi-Factor Authentication")}</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/user/purchase-history" asChild>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>{i18n.t("Purchase History")}</Text>
        </TouchableOpacity>
      </Link>
    
      <Link href="/user/item" asChild>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>{i18n.t("Items")}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    backgroundColor: "#F5FFF0",
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderLeftWidth: 1,
    borderLeftColor: "#E0E0E0",
  },
  navButton: {
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  navButtonText: {
    fontSize: 16,
    color: "#2E7D32",
    fontWeight: "500",
  },
});


export default Navbar;
