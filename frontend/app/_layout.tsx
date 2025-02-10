import { Slot } from "expo-router";
import { AuthProvider } from "@/hooks/providers/AuthProvider";
import { ErrorProvider } from "@/hooks/providers/ErrorProvider";
import { LanguageProvider } from "@/hooks/providers/LanguageProvider";
import "../global.css";
import { View } from "react-native";
import Navbar from "@/components/navbar";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ErrorProvider>
            <Navbar />
            <Slot />
        </ErrorProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
