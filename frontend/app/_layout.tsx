import { Slot } from "expo-router";
import { AuthProvider } from "@/hooks/providers/AuthProvider";
import { ErrorProvider } from "@/hooks/providers/ErrorProvider";
import { LanguageProvider } from "@/hooks/providers/LanguageProvider";
import { ThemeProvider } from "@/hooks/providers/ThemeProvider";
import Navbar from "@/components/navbar";
import "../global.css";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ErrorProvider>
          <ThemeProvider>
            <Navbar />
            <Slot />
          </ThemeProvider>
        </ErrorProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
