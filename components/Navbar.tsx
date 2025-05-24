import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Menu, X, Moon, Sun } from 'lucide-react-native';

export default function Navbar({ insets, darkMode, onToggleDarkMode, isSidebarOpen, onMenuPress }) {
  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <TouchableOpacity onPress={onMenuPress}>
        {isSidebarOpen ? (
          <X size={28} color="#1f2937" />
        ) : (
          <Menu size={28} color="#1f2937" />
        )}
      </TouchableOpacity>

      <Text style={styles.title}>SIMADES</Text>

      <TouchableOpacity onPress={onToggleDarkMode} style={styles.iconButton}>
        {darkMode ? <Sun size={24} color="#1f2937" /> : <Moon size={24} color="#1f2937" />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 8,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
  },
  iconButton: {
    padding: 6,
  },
});
