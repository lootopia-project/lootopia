import { Slot } from "expo-router";
import { AuthProvider } from "@/hooks/providers/AuthProvider";
import { ErrorProvider } from "@/hooks/providers/ErrorProvider";
import { ClerkProvider, ClerkLoaded, } from '@clerk/clerk-expo'
import { LanguageProvider } from "@/hooks/providers/LanguageProvider";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/navbar/footer";
import "../global.css";
import StripeProvider from "@/hooks/providers/StripeProvider";

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
                <Slot />
                <Footer />
              </ErrorProvider>
            </AuthProvider>
          </LanguageProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </StripeProvider>
  );
}
