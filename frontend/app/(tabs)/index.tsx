import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '@/hooks/providers/AuthProvider';
import { useRouter } from 'expo-router';
export default function HomeScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const hangleLogout = async () => {
    try {

      const check = await logout();
      if (check.message) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error in handleLogin:", error);
    }
  };

  const handleMessages = () => {
    router.push("/message");
  }
  return (
    <>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello World !</Text>
      <Button title={">GO tO mESSAGE"} onPress={handleMessages} />
      <Button title="Logout" onPress={hangleLogout} />
    </View>
    </>
  );
}
