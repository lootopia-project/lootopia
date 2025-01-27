import { Slot} from "expo-router";
import { AuthProvider } from "@/hooks/providers/AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  )
}
