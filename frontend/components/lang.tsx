import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import lang from '@/translation';

export default function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState(lang.locale);

  const changeLanguage = (newLang:string) => {
    setSelectedLanguage(newLang);
    lang.locale = newLang;
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue) => changeLanguage(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="🇬🇧 English" value="en" />
        <Picker.Item label="🇫🇷 Français" value="fr" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  picker: {
    width: 200,
    height: 50,
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
