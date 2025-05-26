import { Slot } from "expo-router";
import React from "react";
import {
  View,
  ScrollView,
  Platform,
  useWindowDimensions,
  StyleSheet
} from "react-native";
import Navbar from "@/components/user/navbar";

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web" && width > 768;

  return (
    <View style={styles.container}>
      <View style={[styles.mainWrapper, isWeb ? styles.mainWeb : styles.mainMobile]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.mainContent}>
          <Slot />
        </ScrollView>
      </View>

      {isWeb && (
        <View style={[styles.sidebarWrapper, styles.sidebarWeb]}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.sidebarContent}>
            <Navbar />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  mainWrapper: {
    height: "100%",
    backgroundColor: "#F5FFF0",
  },
  mainWeb: {
    width: "70%",
  },
  mainMobile: {
    width: "100%",
  },
  sidebarWrapper: {
    height: "100%",
    backgroundColor: "#F5FFF0",
    borderLeftWidth: 1,
    borderLeftColor: "#E0E0E0",
  },
  sidebarWeb: {
    width: "30%",
  },
  scroll: {
    flex: 1,
  },
  mainContent: {
    flexGrow: 1,
    padding: 20,
  },
  sidebarContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
});
