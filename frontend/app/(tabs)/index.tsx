import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@/hooks/providers/AuthProvider';
export default function HomeScreen() {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  
  return (
    <>
    <View>
      <Text>Hello World !</Text>
    </View>
    </>
  );
}