import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MessageCircle as ChatIcon } from 'lucide-react-native'; // Impor ikon untuk FAB

// Impor komponen-komponen Anda
import StatsChart from '../components/VisitorsChart';    
import StatsCard from '../components/StatsCard';        
import FormProgressChart from '../components/FormProgressChart'; 
import FloatingChatbot from '../components/FloatingChatbot'; // Path ke komponen chatbot

// --- Konstanta untuk Styling ---
const CONTAINER_PADDING_HORIZONTAL = 20;
const CONTAINER_PADDING_TOP_IOS = 10;
const CONTAINER_PADDING_TOP_ANDROID = 20;
const CONTAINER_PADDING_BOTTOM = 100; // Padding bawah untuk ruang FAB & Chatbot
const HEADER_MARGIN_BOTTOM = 28;
const HEADING_FONT_SIZE = 24;
const SUBHEADING_FONT_SIZE = 14;
const SECTION_TITLE_FONT_SIZE = 18;
const SECTION_TITLE_MARGIN_TOP = 32;
const GRID_ROW_GAP = 16;
const FAB_SIZE = 60;
const FAB_BORDER_RADIUS = FAB_SIZE / 2;
const FAB_POSITION_OFFSET = 25; // Jarak FAB dari tepi layar (lebih kecil dari sebelumnya)
const FAB_ICON_SIZE = 28;

// Fungsi untuk mendapatkan sapaan berdasarkan waktu (tetap sama)
const getTimeBasedGreeting = (): string => {
  const currentHour = new Date().getHours();
  if (currentHour >= 4 && currentHour < 10) return 'Pagi';
  if (currentHour >= 10 && currentHour < 15) return 'Siang';
  if (currentHour >= 15 && currentHour < 18) return 'Sore';
  return 'Malam';
};

export default function HomeScreen() {
  const theme = useTheme();
  const { colors } = theme;

  const userRole = 'Admin';
  const greetingTime = getTimeBasedGreeting();
  const dynamicSubheading = `Selamat ${greetingTime}, ${userRole} 👋`;

  const secondaryTextColor = theme.dark ? '#A0AEC0' : '#718096'; 

  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
        <View style={styles.chartsContainer}>
            <FormProgressChart theme={theme} />
            <View style={{ height: 10 }} /> {/* Spacer antar chart */}
            <StatsChart theme={theme} />
        </View>
      </ScrollView>

      {/* Tombol FAB untuk membuka chatbot */}
      {!isChatbotVisible && (
        <TouchableOpacity
          style={[styles.chatbotToggleButton, { backgroundColor: colors.primary }]}
          onPress={toggleChatbot}
          activeOpacity={0.8}
        >
          <ChatIcon size={FAB_ICON_SIZE} color="white" />
        </TouchableOpacity>
      )}

      {/* Komponen Chatbot Mengambang */}
      {/* Menggunakan 'key' untuk memastikan state direset jika diperlukan saat isVisible berubah,
          namun karena animasi internal sudah menangani, ini mungkin tidak esensial.
          Lebih baik state internal FloatingChatbot yang menangani resetnya sendiri saat onClose/isVisible false.
      */}
      {isChatbotVisible && ( // Lebih baik render kondisional seperti ini untuk performa
        <FloatingChatbot
          isVisible={isChatbotVisible}
          onClose={toggleChatbot}
        />
      )}
    </View>
  );
}

interface Style {
  screen: ViewStyle;
  container: ViewStyle;
  headerContent: ViewStyle;
  heading: TextStyle;
  subheading: TextStyle;
  sectionTitle: TextStyle;
  chartsContainer: ViewStyle;
  grid: ViewStyle;
  chatbotToggleButton: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  screen: {
    flex: 1,
  },
  container: {
    paddingHorizontal: CONTAINER_PADDING_HORIZONTAL,
    paddingTop: Platform.OS === 'ios' ? CONTAINER_PADDING_TOP_IOS : CONTAINER_PADDING_TOP_ANDROID,
    paddingBottom: CONTAINER_PADDING_BOTTOM,
  },
  headerContent: {
    marginBottom: HEADER_MARGIN_BOTTOM,
  },
  heading: {
    fontSize: HEADING_FONT_SIZE,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6,
  },
  subheading: {
    fontSize: SUBHEADING_FONT_SIZE,
    fontFamily: 'Poppins-Regular',
  },
  sectionTitle: {
    fontSize: SECTION_TITLE_FONT_SIZE,
    fontFamily: 'Poppins-SemiBold',
    marginTop: SECTION_TITLE_MARGIN_TOP,
    marginBottom: 4,
  },
  chartsContainer: {
    // Container untuk chart agar bisa diberi styling jika perlu di masa depan
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: GRID_ROW_GAP, 
    // columnGap: GRID_COLUMN_GAP,
  },
  chatbotToggleButton: {
    position: 'absolute',
    bottom: FAB_POSITION_OFFSET,
    right: FAB_POSITION_OFFSET,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
  // chatbotToggleButtonText: { // Tidak lagi digunakan
  //   fontSize: 28,
  //   color: 'white',
  // },
});