import { Slot } from "expo-router";
import { View, ScrollView, Platform, useWindowDimensions } from "react-native";
import Navbar from "@/components/user/navbar";

export default function RootLayout() {
    const { width } = useWindowDimensions();
    const isWeb = (Platform.OS ==='web' && width > 768) ? true : false;

    return (
        <View style={{ flex: 1, flexDirection: "row" }}>
            <ScrollView style={{ flex: 7 }} id="main-content" contentContainerStyle={{ flexGrow: 1 }}>
                <Slot />
            </ScrollView>
            {isWeb && (
                <ScrollView style={{ flex: 3 }}>
                    <Navbar />
                </ScrollView>
            )}
        </View>
    );
}
