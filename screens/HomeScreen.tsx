import React, { useState, useCallback, useEffect } from 'react'; // Menambahkan useCallback, useEffect
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  TouchableOpacity,
  ActivityIndicator, // Untuk indikator loading
  RefreshControl,    // Untuk pull-to-refresh
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MessageCircle as ChatIcon, AlertCircle, BarChart3 } from 'lucide-react-native'; // Menambahkan ikon lain

// Impor komponen-komponen Anda
import StatsChart from '../components/VisitorsChart';
import StatsCard from '../components/StatsCard';
import FormProgressChart from '../components/FormProgressChart';
import FloatingChatbot from '../components/FloatingChatbot';

// --- Konstanta untuk Styling ---
const CONTAINER_PADDING_HORIZONTAL = 20;
const CONTAINER_PADDING_TOP_IOS = 10;
const CONTAINER_PADDING_TOP_ANDROID = 20;
const CONTAINER_PADDING_BOTTOM = 120; // Sedikit ditambah untuk lebih banyak ruang di bawah
const HEADER_MARGIN_BOTTOM = 28;
const HEADING_FONT_SIZE = 26; // Sedikit diperbesar
const SUBHEADING_FONT_SIZE = 15; // Sedikit diperbesar
const SECTION_TITLE_FONT_SIZE = 19; // Sedikit diperbesar
const SECTION_TITLE_MARGIN_TOP = 32;
const SECTION_TITLE_MARGIN_BOTTOM = 20; // Konsistensi margin bawah
const GRID_ROW_GAP = 16;
const FAB_SIZE = 60;
const FAB_BORDER_RADIUS = FAB_SIZE / 2;
const FAB_POSITION_OFFSET = 25;
const FAB_ICON_SIZE = 28;

const getTimeBasedGreeting = (): string => { /* ... (fungsi tetap sama) ... */
  const currentHour = new Date().getHours();
  if (currentHour >= 4 && currentHour < 10) return 'Pagi';
  if (currentHour >= 10 && currentHour < 15) return 'Siang';
  if (currentHour >= 15 && currentHour < 18) return 'Sore';
  return 'Malam';
};

// Komponen untuk menampilkan state kosong atau error pada chart
const DataPlaceholder: React.FC<{ message: string; icon?: React.ReactNode; theme: ReturnType<typeof useTheme> }> = ({ message, icon, theme }) => (
  <View style={[styles.dataPlaceholderContainer, {backgroundColor: theme.colors.card, borderColor: theme.colors.border}]}>
    {icon || <BarChart3 size={40} color={theme.dark ? '#555' : '#ccc'} />}
    <Text style={[styles.dataPlaceholderText, {color: theme.dark ? '#888' : '#777'}]}>{message}</Text>
  </View>
);


export default function HomeScreen() {
  const theme = useTheme();
  const { colors } = theme;

  const userRole = 'Admin';
  const greetingTime = getTimeBasedGreeting();
  const dynamicSubheading = `Selamat ${greetingTime}, ${userRole} 👋`;
  const secondaryTextColor = theme.dark ? '#A0AEC0' : '#718096';

  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // State contoh untuk loading dan data (ganti dengan logika data fetching Anda)
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsData, setStatsData] = useState<any[] | null>(null); // Ganti any dengan tipe data Anda

  const [isLoadingFormProgress, setIsLoadingFormProgress] = useState(true);
  const [formProgressData, setFormProgressData] = useState<any | null>(null);

  // Fungsi placeholder untuk memuat data
  const loadDashboardData = useCallback(async () => {
    setIsLoadingStats(true);
    setIsLoadingFormProgress(true);
    // Simulasi data fetching
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Contoh: Set data atau set menjadi null jika tidak ada data
    setStatsData([{ value: 50 }, { value: 80 }]); // Atau [] jika ingin empty state terpicu
    setFormProgressData({ completed: 75, pending: 25 }); // Atau null

    setIsLoadingStats(false);
    setIsLoadingFormProgress(false);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData().then(() => setRefreshing(false));
  }, [loadDashboardData]);

  const toggleChatbot = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={ // Implementasi Pull-to-Refresh
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary} // Warna indikator refresh untuk iOS
            colors={[colors.primary]} // Warna indikator refresh untuk Android
          />
        }
      >
        <View style={styles.headerContent}>
          <Text style={[styles.heading, { color: colors.text }]}>Dashboard</Text>
          <Text style={[styles.subheading, { color: secondaryTextColor }]}>
            {dynamicSubheading}
          </Text>
        </View>

        <View style={styles.grid}>
          {/* Anda bisa juga menerapkan loading state pada StatsCard jika diperlukan */}
          <StatsCard theme={theme} type="formulir" />
          <StatsCard theme={theme} type="desa" />
          <StatsCard theme={theme} type="kecamatan" />
          <StatsCard theme={theme} type="pengguna" />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Visualisasi Data</Text>

        <View style={styles.chartsContainer}>
          {isLoadingFormProgress ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loadingIndicator} />
          ) : formProgressData ? (
            <FormProgressChart theme={theme} data={formProgressData} /> // Asumsi FormProgressChart menerima prop data
          ) : (
            <DataPlaceholder message="Data Progres Formulir Belum Tersedia" theme={theme}/>
          )}

          <View style={{ height: 24 }} /> {/* Spacer antar chart */}

          {isLoadingStats ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loadingIndicator} />
          ) : statsData && statsData.length > 0 ? (
            <StatsChart theme={theme} data={statsData} /> // Asumsi StatsChart menerima prop data
          ) : (
            <DataPlaceholder message="Data Statistik Pengunjung Belum Tersedia" theme={theme} />
          )}
        </View>
      </ScrollView>

      {!isChatbotVisible && (
        <TouchableOpacity
          style={[styles.chatbotToggleButton, { backgroundColor: colors.primary }]}
          onPress={toggleChatbot}
          activeOpacity={0.8}
        >
          <ChatIcon size={FAB_ICON_SIZE} color="white" />
        </TouchableOpacity>
      )}

      {/* FloatingChatbot akan dirender hanya jika isChatbotVisible true, 
          dan animasi internalnya akan menangani transisi muncul/hilangnya */}
      {isChatbotVisible && (
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
  loadingIndicator: ViewStyle; // Ditambahkan
  dataPlaceholderContainer: ViewStyle; // Ditambahkan
  dataPlaceholderText: TextStyle; // Ditambahkan
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
    lineHeight: SUBHEADING_FONT_SIZE * 1.5, // Line height untuk subheading
  },
  sectionTitle: {
    fontSize: SECTION_TITLE_FONT_SIZE,
    fontFamily: 'Poppins-SemiBold',
    marginTop: SECTION_TITLE_MARGIN_TOP,
    marginBottom: SECTION_TITLE_MARGIN_BOTTOM,
  },
  chartsContainer: {
    // Styling tambahan jika perlu
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: GRID_ROW_GAP,
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
  loadingIndicator: {
    marginTop: 20,
    marginBottom: 20,
    minHeight: 150, // Beri tinggi agar layout tidak terlalu melompat
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataPlaceholderContainer: {
    minHeight: 150, // Tinggi placeholder sama dengan loading
    borderRadius: 12, // Mirip kartu
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed', // Border putus-putus
    marginTop: 10, // Jarak dari judul seksi atau chart sebelumnya
  },
  dataPlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});