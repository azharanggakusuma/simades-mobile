import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Menu, X, Moon, Sun } from 'lucide-react-native'; // Komponen ikon

// --- Konstanta untuk Styling ---
const ICON_SIZE = 24; // Ukuran standar untuk semua ikon di navbar
const ICON_BUTTON_PADDING = 8; // Padding untuk area sentuh ikon
const NAVBAR_HORIZONTAL_PADDING = 16; // Padding horizontal navbar
const NAVBAR_VERTICAL_PADDING_BOTTOM = 12; // Padding bawah navbar
const TITLE_FONT_SIZE = 18;
const TITLE_MARGIN_HORIZONTAL = 8; // Margin horizontal untuk judul agar tidak terlalu mepet ikon

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
export default function Navbar({
  insets,
  darkMode,
  onToggleDarkMode,
  isSidebarOpen,
  onMenuPress,
}) {
  // Warna dinamis berdasarkan mode gelap
  const iconColor = darkMode ? '#E5E7EB' : '#374151'; // Warna ikon sedikit disesuaikan
  const titleColor = darkMode ? '#F9FAFB' : '#111827'; // Warna judul lebih kontras
  const navBackgroundColor = darkMode ? '#1F2937' : '#FFFFFF'; // Latar belakang Navbar (putih untuk light, gelap untuk dark)
  const shadowColor = darkMode ? '#000000' : '#4B5563'; // Warna bayangan

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === 'ios' ? insets.top + 6 : insets.top + 12, // Padding atas dinamis
          paddingBottom: NAVBAR_VERTICAL_PADDING_BOTTOM,
          backgroundColor: navBackgroundColor,
          // Properti shadow untuk iOS
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: darkMode ? 0.3 : 0.08, // Opasitas shadow disesuaikan tema
          shadowRadius: 3,
          // Properti elevation untuk Android
          elevation: 5,
        },
      ]}
    >
      {/* Tombol untuk membuka/menutup Sidebar */}
      <TouchableOpacity onPress={onMenuPress} style={styles.iconButtonContainer}>
        {isSidebarOpen ? (
          <X size={ICON_SIZE} color={iconColor} />
        ) : (
          <Menu size={ICON_SIZE} color={iconColor} />
        )}
      </TouchableOpacity>

      {/* Judul Aplikasi */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: titleColor }]}>SIMADES</Text>
      </View>


      {/* Tombol untuk mengubah mode gelap/terang */}
      <TouchableOpacity onPress={onToggleDarkMode} style={styles.iconButtonContainer}>
        {darkMode ? (
          <Sun size={ICON_SIZE} color={iconColor} />
        ) : (
          <Moon size={ICON_SIZE} color={iconColor} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: NAVBAR_HORIZONTAL_PADDING,
    // borderBottomWidth dan borderBottomColor dihapus, diganti shadow
    // justifyContent: 'space-between' tidak lagi diperlukan jika titleContainer menggunakan flex:1
  },
  iconButtonContainer: {
    padding: ICON_BUTTON_PADDING,
    justifyContent: 'center',
    alignItems: 'center',
    // Tambahkan minWidth dan minHeight jika perlu untuk memastikan area tap minimum
    minWidth: ICON_SIZE + ICON_BUTTON_PADDING * 2,
    minHeight: ICON_SIZE + ICON_BUTTON_PADDING * 2,
  },
  titleContainer: { // Tambahkan container untuk judul agar flexbox bekerja lebih baik
    flex: 1, // Mengambil ruang tengah yang tersedia
    alignItems: 'center', // Menengahkan judul di dalam container-nya
    justifyContent: 'center',
    marginHorizontal: TITLE_MARGIN_HORIZONTAL, // Jarak dari ikon di sisi
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    fontFamily: 'Poppins-Bold', // Pastikan font ini terinstal
    // textAlign: 'center' tidak lagi diperlukan di sini jika titleContainer sudah alignItems: 'center'
  },
});