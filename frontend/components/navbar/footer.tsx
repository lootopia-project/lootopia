import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useWindowDimensions } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/hooks/providers/AuthProvider";

const Footer = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { isAuthenticated } = useAuth();

  return (
    !isMobile
    &&
    isAuthenticated
    &&
    <View style={styles.navContainer}>
      {/* bouton chasse */}
      <TouchableOpacity style={styles.navItem}>
        {/* <Link href={""} style={styles.icon}>🏠</Link> */}
      </TouchableOpacity>
      {/* bouton organisateur */}
      <TouchableOpacity style={styles.navItem}>
        {/* <Link href={""} style={styles.icon}>🗺️</Link> */}
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Link href={"/message"} style={styles.icon}>✉️</Link>
      </TouchableOpacity>
      {/* bouton support & aide */}
      <TouchableOpacity style={styles.navItem}>
        {/* <Link href={""} style={styles.icon}>💬</Link> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#90EE90',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 9999
  },
  navItem: {
    padding: 10
  },
  icon: {
    fontSize: 24,
    color: '#000'
  }
});

export default Footer;