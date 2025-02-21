import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { ImageBackground, View, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContextType } from "@/type/feature/user/theme_context";

// Image de fond par défaut
const IMG_PAR_DEFAUT = "https://lootopia.blob.core.windows.net/lootopia-photos/blanc.jpg";

// Correspondance des couleurs de texte pour chaque fond d'écran (tout en blanc)
const textColors: Record<string, string> = {
    "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8": "#FFFFFF",
    "https://lootopia.blob.core.windows.net/lootopia-photos/foret_background.webp": "#FFFFFF",
    "https://lootopia.blob.core.windows.net/lootopia-photos/map_background.png": "#FFFFFF",
    "https://lootopia.blob.core.windows.net/lootopia-photos/blanc.jpg": "#FFFFFF",
};

// Valeurs par défaut du contexte
const defaultContextValue: ThemeContextType = {
    backgroundImage: IMG_PAR_DEFAUT,
    textColor: "#FFFFFF",
    changeBackground: () => {},
};

const THEME_CONTEXT = createContext(defaultContextValue);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [backgroundImage, setBackgroundImage] = useState<string>(IMG_PAR_DEFAUT);
    const [textColor, setTextColor] = useState<string>("#FFFFFF"); 

    useEffect(() => {
        const loadBackground = async () => {
            const savedBackground = await AsyncStorage.getItem("backgroundImage")||""
            if (savedBackground) {
                setBackgroundImage(savedBackground);
                setTextColor(textColors[savedBackground] || "#FFFFFF");
            }
            console.log("Couleur du texte appliquée :", textColors[savedBackground] || "#FFFFFF");
        };

        loadBackground();
    }, []);

    const changeBackground = async (newImage: string | null) => {
        const selectedImage = newImage || IMG_PAR_DEFAUT;
        setBackgroundImage(selectedImage);
        setTextColor(textColors[selectedImage] || "#FFFFFF");

        if (newImage) {
            await AsyncStorage.setItem("backgroundImage", newImage);
        } else {
            await AsyncStorage.removeItem("backgroundImage");
        }
    };

    return (
        <THEME_CONTEXT.Provider value={{ backgroundImage, textColor, changeBackground }}>
            <View style={styles.container}>
                <ImageBackground
                    source={{ uri: backgroundImage }}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                >
                    {/* Overlay pour améliorer la lisibilité */}
                    <View style={styles.overlay} />

                    {/* Contenu de l'application */}
                    <View style={styles.content}>
                        {children}
                    </View>
                </ImageBackground>
            </View>
        </THEME_CONTEXT.Provider>
    );
};

// Hook pour utiliser le contexte dans d'autres composants
export const useTheme = () => {
    const context = useContext(THEME_CONTEXT);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

// Composant Wrapper pour le texte
export const TextWrapper = ({ children, style }: { children: ReactNode; style?: any }) => {
    const { textColor } = useTheme();

    return <Text style={[{ color: textColor }, style]}>{children}</Text>;
};


// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    backgroundImage: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Ajoute un léger voile pour lisibilité
    },
    content: {
        flex: 1,
        zIndex: 1,
    },
});
