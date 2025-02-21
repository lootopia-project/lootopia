import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '@/hooks/providers/LanguageProvider'; 

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={locale}
        onValueChange={(itemValue) => changeLanguage(itemValue)}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        mode="dropdown"
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Français" value="fr" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    width: 160,
    height: 40,
    color: '#333',
  },
  pickerItem: {
    fontSize: 16,
    height: 44,
  },
});
