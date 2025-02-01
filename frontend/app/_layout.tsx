import { Slot} from "expo-router";
import { AuthProvider } from "@/hooks/providers/AuthProvider";
import LanguageSwitcher from "@/components/lang";
export default function RootLayout() {
  return (
    <AuthProvider>
      <LanguageSwitcher />
      <Slot />
    </AuthProvider>
  )
}
