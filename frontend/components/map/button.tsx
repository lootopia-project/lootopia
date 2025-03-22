import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import ModeButtonProps from '@/type/feature/map/ModeButtonProps';

const ModeButton: React.FC<ModeButtonProps> = ({ currentMode, modeValue, label, onPress }) => {
  const isActive = currentMode === modeValue;

  return (
    <TouchableOpacity
      style={[
        styles.buttonBase,
        isActive ? styles.buttonActive : styles.buttonInactive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.textBase,
          isActive ? styles.textActive : styles.textInactive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 4,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  buttonActive: {
    backgroundColor: '#fff',
    borderColor: '#3b82f6',
  },
  buttonInactive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  textBase: {
    textAlign: 'center',
    fontSize: 16,
  },
  textActive: {
    color: '#3b82f6',
  },
  textInactive: {
    color: '#fff',
  },
});

export default ModeButton;
