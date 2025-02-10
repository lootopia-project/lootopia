import React, { useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme, StatusBar, SafeAreaView } from "react-native";
import { useWindowDimensions } from "react-native";
import { Colors } from "@/constants/Colors";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const theme = useColorScheme() || "light";

  return (
    <>
      {/* Gestion du notch + SafeArea pour éviter les dépassements */}
      <SafeAreaView style={{ backgroundColor: Colors[theme].highlight }}>
        <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />

        {/* Barre de navigation */}
        <View
          className="w-full px-4 flex-row items-center justify-between"
          style={{
            backgroundColor: Colors[theme].highlight,
            paddingVertical: 12, // Ajustement de la hauteur
            paddingTop: StatusBar.currentHeight || 16, // Gestion du notch et espacement
            marginBottom: 5, // Abaisse légèrement la navbar
          }}
        >
          <Text className="text-lg font-bold" style={{ color: Colors[theme].tint }}>
            Lootopia
          </Text>

          {/* Menu Burger uniquement en mobile */}
          {isMobile ? (
            <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} className="p-2">
              <Text className="text-2xl" style={{ color: Colors[theme].tint }}>
                {menuOpen ? "✖" : "☰"}
              </Text>
            </TouchableOpacity>
          ) : (
            // Menu horizontal en desktop
            <View className="flex flex-row space-x-4">
              <TouchableOpacity>
                <Text className="text-lg" style={{ color: Colors[theme].text }}>🏴 Accueil</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-lg" style={{ color: Colors[theme].text }}>🔍 Chasses</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-lg" style={{ color: Colors[theme].text }}>⚔ Profil</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Menu déroulant en mobile */}
        {menuOpen && isMobile && (
          <View className="absolute left-0 w-full bg-[#F5DEB3] p-4 rounded-b-lg shadow-md" style={{ top: (StatusBar.currentHeight || 0) + 50 }}>
            <TouchableOpacity>
              <Text className="py-2" style={{ color: Colors[theme].text }}>🏴 Accueil</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="py-2" style={{ color: Colors[theme].text }}>🔍 Chasses</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="py-2" style={{ color: Colors[theme].text }}>⚔ Profil</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default Navbar;
