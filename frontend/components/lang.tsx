import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '@/hooks/providers/LanguageProvider'; 

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useLanguage();

  return (
    <View>
      <Picker
        selectedValue={locale}
        onValueChange={(itemValue) => changeLanguage(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Français" value="fr" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
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
