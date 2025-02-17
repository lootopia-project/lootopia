import { Slot } from "expo-router";
import { AuthProvider } from "@/hooks/providers/AuthProvider";
import { ErrorProvider } from "@/hooks/providers/ErrorProvider";
import { LanguageProvider } from "@/hooks/providers/LanguageProvider";
import Navbar from "@/components/navbar";
import "../global.css";

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
