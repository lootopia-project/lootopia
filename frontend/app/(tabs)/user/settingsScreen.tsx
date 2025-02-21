import React from "react";
import { View, Button, Image, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { useTheme } from "@/hooks/providers/ThemeProvider";

const backgroundOptions = [
    "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8",
    "https://lootopia.blob.core.windows.net/lootopia-photos/foret_background.webp",
    "https://lootopia.blob.core.windows.net/lootopia-photos/map_background.png",
];

export default function SettingsScreen() {
    const { backgroundImage, changeBackground } = useTheme();

    return (
        // <ImageBackground
        //     source={{ uri: backgroundImage || "https://example.com/image.jpg" }}

        //     style={{ flex: 1 }}
        //     resizeMode="cover"
        // >
    
            <ScrollView style={{ padding: 20 }}>
                <Button title="Réinitialiser le fond" onPress={() => changeBackground(null)} />

                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 20 }}>
                    {backgroundOptions.map((img, index) => (
                        <TouchableOpacity key={index} onPress={() => changeBackground(img)}>
                            <Image source={{ uri: img }} style={{ width: 100, height: 100, margin: 10, borderRadius: 10 }} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        // </ImageBackground>
    );
}
