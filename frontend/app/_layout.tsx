import { Slot } from "expo-router";
import { AuthProvider } from "@/hooks/providers/AuthProvider";
import { ErrorProvider } from "@/hooks/providers/ErrorProvider";
import { LanguageProvider } from "@/hooks/providers/LanguageProvider";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/navbar/footer";
import "../global.css";
import StripeProvider from "@/hooks/providers/StripeProvider";

export default function RootLayout() {
  return (
      <StripeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ErrorProvider>
              <Navbar />
              <Slot />
              <Footer />
            </ErrorProvider>
          </AuthProvider>
        </LanguageProvider>
      </StripeProvider>
  );
}
