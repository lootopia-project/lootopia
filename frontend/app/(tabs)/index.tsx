import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '@/hooks/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/hooks/providers/LanguageProvider';

export default function HomeScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const {i18n} = useLanguage();
  const hangleLogout = async () => {
    try {

      const check = await logout();
      if (check.message) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error in hangleLogout:", error);
    }
  };

  const handleMessages = () => {
    router.push("/message");
  }
  return (
    <>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{i18n.t("Hello World !")}</Text>
      <Button title={i18n.t("logout")} onPress={hangleLogout} />
        <Button title={">GO tO mESSAGE"} onPress={handleMessages} />
    </View>
    </>
  );
}
