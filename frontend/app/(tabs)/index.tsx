import React from 'react';
import { View, Text, Button } from 'react-native';
import { useLanguage } from '@/hooks/providers/LanguageProvider';

export default function HomeScreen() {
  const {i18n} = useLanguage();

  return (
    <>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{i18n.t("Hello World !")}</Text>
    </View>
    </>
  );
}
