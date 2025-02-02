import { Slot } from "expo-router";
import { AuthProvider } from "@/hooks/providers/AuthProvider";
import { ErrorProvider } from "@/hooks/providers/ErrorProvider";
import '../global.css'

export default function RootLayout() {
  return (
    <AuthProvider>
      <ErrorProvider>
        <Slot />
      </ErrorProvider>
    </AuthProvider>
  )
}
