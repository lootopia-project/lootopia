import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Truc() {
  return (
    <>
    <View>
      <Text>Truc test</Text>
      <Link href={'/'}>index</Link>
    </View>
    </>
  );
}