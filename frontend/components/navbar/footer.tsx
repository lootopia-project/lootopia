import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useWindowDimensions } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/hooks/providers/AuthProvider";

const Footer = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { isAuthenticated } = useAuth();

  if (isMobile || !isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.navContainer}>
      {/* Accueil (exemple) */}
      <TouchableOpacity style={styles.navItem}>
        <Link href="/" style={styles.icon}>🏠</Link>
      </TouchableOpacity>

      {/* Chasses */}
      <TouchableOpacity style={styles.navItem}>
        <Link href="/hunting" style={styles.icon}>🗺️</Link>
      </TouchableOpacity>

      {/* Messages */}
      <TouchableOpacity style={styles.navItem}>
        <Link href="/message" style={styles.icon}>✉️</Link>
      </TouchableOpacity>

      {/* Support & Aide */}
      <TouchableOpacity style={styles.navItem}>
        <Link href="/support" style={styles.icon}>💬</Link>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 9999,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 24,
    color: "#FFFFFF",
  },
});

export default Footer;
