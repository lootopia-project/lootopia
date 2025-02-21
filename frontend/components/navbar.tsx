import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme, StatusBar, SafeAreaView, StyleSheet, Image } from "react-native";
import { useWindowDimensions } from "react-native";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { useAuth } from "@/hooks/providers/AuthProvider";
import { useRouter } from "expo-router";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import LanguageSwitcher from "./lang";
import { useErrors } from "@/hooks/providers/ErrorProvider";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const theme = useColorScheme() || "light";
  const { isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { i18n } = useLanguage();
  const [img, setImg] = useState("");
  const { setErrorMessage, setErrorVisible } = useErrors();
  const handleMessages = () => {
    router.push("/message");
  }

  useEffect(() => {
    if (isAuthenticated) {
      const img = localStorage.getItem("img");
      setImg("https://lootopia.blob.core.windows.net/lootopia-photos/user.png");
      if (img) {
        setImg(img);
      }
    }
  }, [isAuthenticated]);


  const hangleLogout = async () => {
    try {

      const check = await logout();
      if (check.message) {
        router.push("/login");
      }
    } catch (error) {
      setErrorMessage(i18n.t("An error occurred while logging out."));
      setErrorVisible(true);
    }
  };
  return (
    <>
      <View style={styles.navWrapper}>

        <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[theme].highlight }]}>
          <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
          <View style={[styles.navBarContainer, { backgroundColor: Colors[theme].highlight }]}>
            {isAuthenticated ? (
              <Link href="/" style={[styles.brandLink, { color: Colors[theme].tint }]}>
                Lootopia
              </Link>
            ) : (
              <Link href="/login" style={[styles.brandLink, { color: Colors[theme].tint }]}>
                Lootopia
              </Link>
            )}

            <View style={styles.linksRowRight}>
              { !isAuthenticated ?
                (
                  <LanguageSwitcher />
                )
                : (
                  <TouchableOpacity onPress={handleMessages}>
                    <Text style={[styles.navLink, { color: Colors[theme].tint }]}>
                      { isMobile?
                    <>✉️</>        
                    :
                    (i18n.t("Messages"))
                    }
                    </Text>
                  </TouchableOpacity>
                )
              }
              {/* links right */}
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
              <TouchableOpacity>
                <Text style={[styles.mobileMenuText, { color: Colors[theme].text }]}>
                  🏴 Accueil
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={[styles.mobileMenuText, { color: Colors[theme].text }]}>
                  🔍 Chasses
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={[styles.mobileMenuText, { color: Colors[theme].text }]}>
                  ⚔ Profil
                </Text>
              </TouchableOpacity>
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
  }
});

export default Navbar;
