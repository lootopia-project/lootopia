import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useLanguage } from "@/hooks/providers/LanguageProvider";

const Navbar = () => {
  const { i18n } = useLanguage();
  return (
    <View style={styles.navContainer}>
      <Link href="/user/edit">
        <TouchableOpacity style={styles.navButton}>
          <Text>{i18n.t("Edit User")}</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/user/2fa">
        <TouchableOpacity style={styles.navButton}>
          <Text>{i18n.t("Multi-Factor Authentication")}</Text>
        </TouchableOpacity>
      </Link>

      <Link href= "/user/purchase-history">
        <TouchableOpacity style={styles.navButton}>
          <Text>{i18n.t("Purchase History")}</Text>
        </TouchableOpacity>

      </Link>
    
      <Link href="/user/item">
        <TouchableOpacity style={styles.navButton}>
          <Text>{i18n.t("Items")}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: "absolute",
    right: 0,
  },
  navButton: {
    backgroundColor: "#F5DEB3",
    marginVertical: 10,
    width: 250,
    paddingVertical: 14,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Navbar;
