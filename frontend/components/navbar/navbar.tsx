import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme, StatusBar, SafeAreaView, StyleSheet, Image, Platform, useWindowDimensions } from "react-native";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { useAuth } from "@/hooks/providers/AuthProvider";
import { useRouter } from "expo-router";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import LanguageSwitcher from "../lang";
import { useErrors } from "@/hooks/providers/ErrorProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = (Platform.OS !== 'web') ? true : width < 768;
  const theme = useColorScheme() || "light";
  const { isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { i18n } = useLanguage();
  const [img, setImg] = useState("");
  const [crowns, setCrowns] = useState(0);
  const { setErrorMessage, setErrorVisible } = useErrors();
    const pathName = usePathname();
  useEffect(() => {
    const fetchImg = async () => {
      if (isAuthenticated) {
        const img = await AsyncStorage.getItem("img");
        const crowns = await AsyncStorage.getItem("crowns") || "0";
        setCrowns(parseInt(crowns, 10));
        setImg("https://lootopia.blob.core.windows.net/lootopia-photos/user.png");
        if (img) {
          setImg(img);
        }
      }
    };
    fetchImg();
  }, [isAuthenticated,pathName]);


  const hangleLogout = async () => {
    try {

      await logout();
    
    } catch (error) {
      setErrorMessage(i18n.t("An error occurred while logging out"));
      setErrorVisible(true);
    }
  };
  return (
    <>
      <View style={styles.navWrapper}>
        <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors.bgNav }]}>
          <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
          <View style={[styles.navBarContainer, { backgroundColor: Colors.bgNav }]}>
            <Link href="/" style={[styles.brandLink, { color: 'white' }]}>
              Lootopia
            </Link>
            <View style={styles.linksRowRight}>
              {!isAuthenticated && !isMobile ?
                (
                  <View className="flex items-center justify-center flex-row ">
                    <LanguageSwitcher />
                    <View style={styles.auth}>
                      <TouchableOpacity>
                        <Link href={"/login"}>{i18n.t("login")}</Link>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Link href={"/register"}>{i18n.t("Register")}</Link>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
                : (
                  <>
                    {/* links right */}
                    {!isAuthenticated && <LanguageSwitcher /> }
                  </>

                )
              }
                {isAuthenticated && (
                <View style={styles.crownContainer}>
                  <Image
                    source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-object/crown.png" }}
                    style={styles.crownIcon}
                  />
                  <Text style={styles.crownText}>{crowns}</Text>

                  <TouchableOpacity onPress={() => router.push("/shop/buy-crown")}>
                    <Text style={styles.plusButton}>+</Text>
                </TouchableOpacity>
                </View>
              )}

  {/* 🛒 Icône du shop dans une autre div */}
  {isAuthenticated && (
    <View style={styles.shopContainer}>
      <TouchableOpacity onPress={() => router.push("/shop")}>
        <Feather name="shopping-cart" size={26} color="white" />
      </TouchableOpacity>
    </View>
  )}
              {/* dropdown right menu */}
              {isAuthenticated && !isMobile &&
                (
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                      onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                      style={styles.dropdownButton}>
                      <View style={styles.imgUser}>
                        <Image source={{ uri: img }} style={styles.imgUser} />
                      </View>
                    </TouchableOpacity>

                    {isDropdownOpen && (
                      <View style={styles.dropdownMenu}>
                        <TouchableOpacity style={styles.dropdownMenuItem}>
                          <Link href={"/user/edit"} style={styles.dropdownMenuItemText}>{i18n.t("Personnal information")}</Link>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={hangleLogout} style={styles.dropdownMenuItem}>
                          <Text style={styles.dropdownMenuItemText}>{i18n.t("logout")}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )
              }
            </View>

            {isMobile && (
              <View style={styles.hamburgerWrapper}>
                <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.hamburgerBtn}>
                  <Text style={[styles.hamburgerIcon, { color: Colors[theme].tint }]}>
                    {menuOpen ? "✖" : "☰"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {menuOpen && isMobile && (
            <View style={styles.mobileMenu}>
              {isAuthenticated ?
                <>
                  <TouchableOpacity>
                    <Link href={"/user/edit"} style={[styles.mobileMenuText, { color: Colors[theme].text }]}>
                      {i18n.t("Edit User")}
                    </Link>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Link href={"/user/2fa"} style={[styles.mobileMenuText, { color: Colors[theme].text }]}>
                      {i18n.t("Multi-Factor Authentication")}
                    </Link>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Link href={"/message"} style={[styles.mobileMenuText, { color: Colors[theme].text }]}>
                      {i18n.t("Messages")}
                    </Link>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={hangleLogout}>
                    <Text style={[styles.mobileMenuText, { color: Colors[theme].text }]}>{i18n.t("logout")}</Text>
                  </TouchableOpacity>
                </>
                :
                <>
                  <TouchableOpacity>
                    <Link href={"/login"} style={[styles.mobileMenuText, { color: Colors[theme].text }]}>
                      {i18n.t("login")}
                    </Link>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Link href={"/register"} style={[styles.mobileMenuText, { color: Colors[theme].text }]}>
                      {i18n.t("Register")}
                    </Link>
                  </TouchableOpacity>
                </>
              }
            </View>
          )}
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    position: "relative",
    zIndex: 9999
  },
  safeArea: {
    width: "100%"
  },
  navBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20
  },
  brandLink: {
    fontSize: 18,
    fontWeight: "bold"
  },
  linksRowRight: {
    flexDirection: "row",
    gap: 16,
    marginLeft: "auto",
    alignItems: "center"
  },
  navLink: {
    fontSize: 18
  },
  hamburgerWrapper: {
    marginLeft: "auto"
  },
  hamburgerBtn: {
    padding: 8
  },
  hamburgerIcon: {
    fontSize: 24
  },
  mobileMenu: {
    position: "relative",
    left: 0,
    width: "100%",
    backgroundColor: "#F5DEB3",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  mobileMenuText: {
    paddingVertical: 8
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdownButton: {
    cursor: "pointer"
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333"
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    zIndex: 999
  },
  dropdownMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  dropdownMenuItemText: {
    fontSize: 16,
    color: "#333"
  },
  imgUser: {
    width: 50,
    height: 50,
    backgroundColor: '#E5E7EB',
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  auth: {
    flexDirection: 'row',
    gap: 16,
    marginLeft: 20
  },
  crownContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 6,
    borderRadius: 8,
  },
  crownIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
  },
  crownText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  plusButton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 8,
  },
  shopContainer: {
    backgroundColor: "#222", 
    padding: 8,
    borderRadius: 8,
    marginLeft: 12, 
    alignItems: "center",
    justifyContent: "center",
  },
  
  
});

export default Navbar;
