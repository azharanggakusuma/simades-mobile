import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  TouchableOpacity, // Untuk tombol FAB
} from 'react-native';
import { useTheme } from '@react-navigation/native'; // Asumsi Anda menggunakan React Navigation Theme

// Impor komponen-komponen Anda
import StatsChart from '../components/VisitorsChart';     // Pastikan path ini benar
import StatsCard from '../components/StatsCard';          // Pastikan path ini benar
import FormProgressChart from '../components/FormProgressChart'; // Pastikan path ini benar
import FloatingChatbot from '../components/FloatingChatbot'; // Path ke komponen chatbot

// Fungsi untuk mendapatkan sapaan berdasarkan waktu
const getTimeBasedGreeting = (): string => {
  const currentHour = new Date().getHours();
  // Rentang waktu bisa disesuaikan
  if (currentHour >= 4 && currentHour < 10) { // 04:00 - 09:59 -> Pagi
    return 'Pagi';
  } else if (currentHour >= 10 && currentHour < 15) { // 10:00 - 14:59 -> Siang
    return 'Siang';
  } else if (currentHour >= 15 && currentHour < 18) { // 15:00 - 17:59 -> Sore
    return 'Sore';
  } else { // 18:00 - 03:59 (termasuk tengah malam hingga sebelum subuh) -> Malam
    return 'Malam';
  }
};

export default function HomeScreen() {
  const theme = useTheme(); // Mengambil tema dari React Navigation
  const { colors } = theme; // Mengambil warna dari tema

  // Placeholder untuk peran pengguna, ganti dengan data aktual jika ada
  const userRole = 'Admin'; // Contoh: 'Admin', 'Petugas Desa', dll.
  const greetingTime = getTimeBasedGreeting();
  const dynamicSubheading = `Selamat ${greetingTime}, ${userRole} 👋`;

  // Warna teks sekunder berdasarkan tema (terang/gelap)
  const secondaryTextColor = theme.dark ? '#A0AEC0' : '#4A5568'; // Contoh warna

  // State untuk mengontrol visibilitas chatbot
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  // Fungsi untuk membuka/menutup chatbot
  const toggleChatbot = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Membantu interaksi dengan input di dalam ScrollView saat keyboard aktif
      >
        {/* Konten Header Dashboard */}
        <View style={styles.headerContent}>
          <Text style={[styles.heading, { color: colors.text }]}>Dashboard</Text>
          <Text style={[styles.subheading, { color: secondaryTextColor }]}>
            {dynamicSubheading}
          </Text>
        </View>

        {/* Grid untuk StatsCard */}
        <View style={styles.grid}>
          <StatsCard theme={theme} type="formulir" />
          <StatsCard theme={theme} type="desa" />
          <StatsCard theme={theme} type="kecamatan" />
          <StatsCard theme={theme} type="pengguna" />
        </View>

        {/* Judul Seksi untuk Visualisasi Data */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Visualisasi Data</Text>

        {/* Komponen Chart */}
        <FormProgressChart theme={theme} />
        <StatsChart theme={theme} />
        {/* Anda bisa menambahkan lebih banyak komponen di sini jika perlu */}

      </ScrollView>

      {/* Tombol Floating Action Button (FAB) untuk membuka chatbot */}
      {/* Hanya ditampilkan jika chatbot tidak visible */}
      {!isChatbotVisible && (
        <TouchableOpacity
          style={[styles.chatbotToggleButton, { backgroundColor: colors.primary }]} // Gunakan warna primer dari tema
          onPress={toggleChatbot}
          activeOpacity={0.8} // Efek opacity saat ditekan
        >
          {/* Ganti dengan icon jika Anda menggunakan library icon (misal: react-native-vector-icons) */}
          <Text style={styles.chatbotToggleButtonText}>💬</Text>
        </TouchableOpacity>
      )}

      {/* Komponen Chatbot Mengambang */}
      {/* Dirender di sini agar posisinya absolut relatif terhadap 'styles.screen' */}
      {/* Dan `isVisible` akan mengontrol apakah ia benar-benar muncul atau tidak */}
      {isChatbotVisible && (
        <FloatingChatbot
          isVisible={isChatbotVisible} // Prop ini bisa digunakan untuk animasi internal di FloatingChatbot jika ada
          onClose={toggleChatbot}    // Fungsi untuk menutup chatbot dari dalam komponen chatbot itu sendiri
        />
      )}
    </View>
  );
}

// Definisi interface untuk styles
interface Style {
  screen: ViewStyle;
  container: ViewStyle;
  headerContent: ViewStyle;
  heading: TextStyle;
  subheading: TextStyle;
  sectionTitle: TextStyle;
  grid: ViewStyle;
  chatbotToggleButton: ViewStyle;
  chatbotToggleButtonText: TextStyle;
}

// StyleSheet untuk komponen HomeScreen
const styles = StyleSheet.create<Style>({
  screen: {
    flex: 1, // Memastikan View mengisi seluruh layar
    // backgroundColor diatur inline menggunakan theme.colors.background
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20, // Padding atas berbeda untuk iOS dan Android
    // Padding bawah yang cukup agar konten tidak tertutup oleh FAB atau window chat.
    // Jika window chat Anda tinggi, Anda mungkin perlu padding lebih besar
    // atau pastikan window chat tidak tumpang tindih dengan konten yang bisa di-scroll.
    paddingBottom: 100,
  },
  headerContent: {
    marginBottom: 28,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold', // Pastikan font ini sudah di-link di proyek Anda
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular', // Pastikan font ini sudah di-link
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold', // Pastikan font ini sudah di-link
    marginTop: 32,
    // marginBottom: 16, // Opsional, jika ingin ada jarak bawah sebelum chart berikutnya
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Menyebar card secara merata
    rowGap: 16, // Jarak antar baris di grid
    // marginBottom: 24, // Opsional, jika ingin ada jarak bawah sebelum section title berikutnya
  },
  chatbotToggleButton: {
    position: 'absolute', // Posisi absolut relatif terhadap parent (styles.screen)
    bottom: 30,           // Jarak dari bawah layar
    right: 30,            // Jarak dari kanan layar
    width: 60,
    height: 60,
    borderRadius: 30,     // Membuat tombol menjadi bulat
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,         // Shadow untuk Android
    shadowColor: '#000',  // Shadow untuk iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,          // Pastikan FAB di atas ScrollView, tapi di bawah window chatbot jika terbuka (window chatbot punya zIndex 1000)
  },
  chatbotToggleButtonText: {
    fontSize: 28,
    color: 'white',       // Warna icon/teks pada FAB
  },
});