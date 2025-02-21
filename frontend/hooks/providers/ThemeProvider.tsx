import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { ImageBackground, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContextType } from "@/type/feature/user/theme_context";

const defaultContextValue: ThemeContextType = {
    backgroundImage: null,
    changeBackground: () => {},
};

const THEME_CONTEXT = createContext(defaultContextValue);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

    useEffect(() => {
        const loadBackground = async () => {
            const savedBackground = await AsyncStorage.getItem("backgroundImage");
            console.log("Image récupérée depuis AsyncStorage :", savedBackground);
            if (savedBackground) {
                setBackgroundImage(savedBackground);
            }
        };
        loadBackground();
    }, []);

    const changeBackground = async (newImage: string | null) => {
        console.log("Changement de l'image de fond :", newImage);
        setBackgroundImage(newImage);
        if (newImage) {
            await AsyncStorage.setItem("backgroundImage", newImage);
        } else {
            await AsyncStorage.removeItem("backgroundImage");
        }
    };

    return (
        <THEME_CONTEXT.Provider value={{ backgroundImage, changeBackground }}>
            <View style={styles.container}>

            <ImageBackground
                source={backgroundImage ? { uri: backgroundImage } : null}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                {/* Overlay sombre pour diminuer la visibilité du fond */}
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

// Hook pour utiliser le contexte
export const useTheme = () => {
    const context = useContext(THEME_CONTEXT);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
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
        position: "absolute",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // Couvre toute la zone
        backgroundColor: "rgba(0, 0, 0, 0.5)", // 80% sombre
    },
    content: {
        flex: 1, // Garde les enfants bien positionnés
        zIndex: 1, // S'assure que le contenu est bien au-dessus
    },
});