import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <>
    <View>
      <Text>Hello World</Text>
      <Link href={'/Truc'}>Truc</Link>
    </View>
    </>
  );
}