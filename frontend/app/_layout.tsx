import { Slot } from "expo-router";
import { AuthProvider } from "@/hooks/providers/AuthProvider";
import { ErrorProvider } from "@/hooks/providers/ErrorProvider";
import { LanguageProvider } from "@/hooks/providers/LanguageProvider";
import LanguageSwitcher from "@/components/lang";
export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ErrorProvider>
          <LanguageSwitcher />
          <Slot />
        </ErrorProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
