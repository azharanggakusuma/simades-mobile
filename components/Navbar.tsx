// components/Navbar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Menu, X, Moon, Sun } from 'lucide-react-native';

export default function Navbar({ insets, darkMode, onToggleDarkMode, isSidebarOpen, onMenuPress }) {
  const iconColor = darkMode ? "#f9fafb" : "#1f2937";
  const titleColor = darkMode ? '#f3f4f6' : '#111827';
  const backgroundColor = darkMode ? '#1f2937' : '#f9fafb';
  const borderBottomColor = darkMode ? '#374151' : '#e5e7eb';


  return (
    <View style={[
        styles.container,
        {
            paddingTop: Platform.OS === 'ios' ? insets.top + 5 : insets.top + 10,
            paddingBottom: 10,
            backgroundColor: backgroundColor,
            borderBottomColor: borderBottomColor,
        }
    ]}>
      <TouchableOpacity onPress={onMenuPress} style={styles.iconButtonContainer}>
        {isSidebarOpen ? (
          <X size={28} color={iconColor} />
        ) : (
          <Menu size={28} color={iconColor} />
        )}
      </TouchableOpacity>

      <Text style={[styles.title, { color: titleColor }]}>SIMADES</Text>

      <TouchableOpacity onPress={onToggleDarkMode} style={styles.iconButtonContainer}>
        {darkMode ? <Sun size={24} color={iconColor} /> : <Moon size={24} color={iconColor} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    // Properti shadow tidak berfungsi baik jika backgroundColor dinamis, jadi bisa dihilangkan atau dikelola dengan View terpisah jika perlu
  },
  iconButtonContainer: {
    padding: 6, // Area sentuh yang lebih baik
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    flex: 1, // Agar title bisa di tengah jika space-between digunakan
    marginHorizontal: 10, // Jarak dari ikon
  },
});