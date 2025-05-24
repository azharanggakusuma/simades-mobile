import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Menu, X, Moon, Sun } from 'lucide-react-native'; // Komponen ikon

/**
 * Komponen Navbar menampilkan bar navigasi atas.
 * Termasuk tombol menu, judul, dan tombol toggle mode gelap.
 *
 * @param {object} insets - Nilai safe area insets dari useSafeAreaInsets.
 * @param {boolean} darkMode - Status mode gelap saat ini.
 * @param {function} onToggleDarkMode - Fungsi callback untuk mengubah mode gelap.
 * @param {boolean} isSidebarOpen - Status apakah sidebar sedang terbuka (untuk mengubah ikon menu).
 * @param {function} onMenuPress - Fungsi callback ketika tombol menu ditekan.
 */
export default function Navbar({ insets, darkMode, onToggleDarkMode, isSidebarOpen, onMenuPress }) {
  // Warna dinamis berdasarkan mode gelap
  const iconColor = darkMode ? '#f9fafb' : '#1f2937';
  const titleColor = darkMode ? '#f3f4f6' : '#111827';
  const navBackgroundColor = darkMode ? '#1f2937' : '#f9fafb'; // Latar belakang Navbar
  const navBorderBottomColor = darkMode ? '#374151' : '#e5e7eb'; // Warna border bawah Navbar

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === 'ios' ? insets.top + 5 : insets.top + 10, // Padding atas dinamis untuk status bar
          paddingBottom: 10,
          backgroundColor: navBackgroundColor,
          borderBottomColor: navBorderBottomColor,
        },
      ]}>
      {/* Tombol untuk membuka/menutup Sidebar, ikon berubah sesuai status isSidebarOpen */}
      <TouchableOpacity onPress={onMenuPress} style={styles.iconButtonContainer}>
        {isSidebarOpen ? <X size={28} color={iconColor} /> : <Menu size={28} color={iconColor} />}
      </TouchableOpacity>

      <Text style={[styles.title, { color: titleColor }]}>SIMADES</Text>

      {/* Tombol untuk mengubah mode gelap/terang */}
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
    justifyContent: 'space-between', // Menyusun item dengan jarak merata
  },
  iconButtonContainer: {
    padding: 6, // Area sentuh yang lebih baik untuk ikon
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center', // Judul di tengah
    flex: 1, // Memungkinkan judul mengisi ruang yang tersedia
    marginHorizontal: 10, // Jarak dari ikon di sisi
  },
});
