import React, { useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme, StatusBar, SafeAreaView, SafeAreaViewComponent } from "react-native";
import { useWindowDimensions } from "react-native";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { useAuth } from "@/hooks/providers/AuthProvider";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const theme = useColorScheme() || "light";
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);

  return (
    <>
      <SafeAreaView id="tru" style={{ backgroundColor: Colors[theme].highlight }}>
        <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />

        <View
          className="flex-row justify-between mb-5"
          style={{
            backgroundColor: Colors[theme].highlight,
          }} >
          {isAuthenticated
            ?
            <Link href={"/index"} className="text-lg font-bold" style={{ color: Colors[theme].tint }}>
              Lootopia
            </Link> :
            <Link href={"/login"} className="text-lg font-bold" style={{ color: Colors[theme].tint }}>
              Lootopia
            </Link>
          }

          <View className="flex flex-row space-x-4">
            <TouchableOpacity>
              <Link href={"/"} className="text-lg" style={{ color: Colors[theme].text }}>🏴 Accueil</Link>
            </TouchableOpacity>
          </View>

          {isMobile ? (
            //native wind fix the viesw to the right
            <View className="ml-auto">
              <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} className="p-2">
                <Text className="text-2xl" style={{ color: Colors[theme].tint }}>
                  {menuOpen ? "✖" : "☰"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : <></>
          }
        </View>

        {menuOpen && isMobile && (
          <View className="absolute left-0 w-full bg-[#F5DEB3] p-4 rounded-b-lg shadow-md">
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
