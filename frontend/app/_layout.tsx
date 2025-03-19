import { Slot } from "expo-router";
import { AuthProvider } from "@/hooks/providers/AuthProvider";
import { ErrorProvider } from "@/hooks/providers/ErrorProvider";
import { ClerkProvider, ClerkLoaded, } from '@clerk/clerk-expo'
import { LanguageProvider } from "@/hooks/providers/LanguageProvider";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/navbar/footer";
import "../global.css";
import 'leaflet/dist/leaflet.css';
import StripeProvider from "@/hooks/providers/StripeProvider";
import { View } from "react-native";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

  return (
    <StripeProvider>
      <ClerkProvider publishableKey={publishableKey} >
        <ClerkLoaded>
          <LanguageProvider>
            <AuthProvider>
              <ErrorProvider>
                <Navbar />
                <View className="flex-1">
                <Slot />
                </View>
                <Footer />
              </ErrorProvider>
            </AuthProvider>
          </LanguageProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </StripeProvider>
  );
}
