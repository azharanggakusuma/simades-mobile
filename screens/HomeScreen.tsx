import React, { useState, useCallback, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  TouchableOpacity,
  // ActivityIndicator, // Dihapus, diganti skeleton
  RefreshControl,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MessageCircle as ChatIcon, AlertCircle, BarChart3 } from 'lucide-react-native';

// Impor komponen-komponen Anda
import StatsChart from '../components/VisitorsChart';
import StatsCard from '../components/StatsCard';
import FormProgressChart from '../components/FormProgressChart';
import FloatingChatbot from '../components/FloatingChatbot';

// --- Konstanta untuk Styling (tetap sama) ---
const CONTAINER_PADDING_HORIZONTAL = 20;
const CONTAINER_PADDING_TOP_IOS = 10;
const CONTAINER_PADDING_TOP_ANDROID = 20;
const CONTAINER_PADDING_BOTTOM = 120;
const HEADER_MARGIN_BOTTOM = 28;
const HEADING_FONT_SIZE = 26;
const SUBHEADING_FONT_SIZE = 15;
const SECTION_TITLE_FONT_SIZE = 18;
const SECTION_TITLE_MARGIN_TOP = 32;
const SECTION_TITLE_MARGIN_BOTTOM = 16;
const GRID_ROW_GAP = 16;
const FAB_SIZE = 60;
const FAB_BORDER_RADIUS = FAB_SIZE / 2;
const FAB_POSITION_OFFSET = 25;
const FAB_ICON_SIZE = 28;

const getTimeBasedGreeting = (): string => { /* ... */
  const currentHour = new Date().getHours();
  if (currentHour >= 4 && currentHour < 10) return 'Pagi';
  if (currentHour >= 10 && currentHour < 15) return 'Siang';
  if (currentHour >= 15 && currentHour < 18) return 'Sore';
  return 'Malam';
};

// Komponen untuk menampilkan state kosong atau error pada chart (tetap sama)
const DataPlaceholder: React.FC<{ message: string; icon?: React.ReactNode; theme: ReturnType<typeof useTheme> }> = ({ message, icon, theme }) => (
  <View style={[styles.dataPlaceholderContainer, {backgroundColor: theme.colors.card, borderColor: theme.colors.border}]}>
    {icon || <BarChart3 size={40} color={theme.dark ? '#555' : '#ccc'} />}
    <Text style={[styles.dataPlaceholderText, {color: theme.dark ? '#888' : '#777'}]}>{message}</Text>
  </View>
);

// --- Komponen Skeleton untuk Chart ---
const ChartSkeleton: React.FC<{ theme: ReturnType<typeof useTheme>; height?: number }> = ({ theme, height = 200 }) => {
  // Warna skeleton disesuaikan dengan tema
  const skeletonBackgroundColor = theme.dark ? '#2D3748' : '#E2E8F0'; // Abu-abu gelap untuk dark, abu-abu terang untuk light
  return (
    <View style={[styles.skeletonItem, { height, backgroundColor: skeletonBackgroundColor }]} />
  );
};


export default function HomeScreen() {
  const theme = useTheme();
  const { colors } = theme;

  const userRole = 'Admin';
  const greetingTime = getTimeBasedGreeting();
  const dynamicSubheading = `Selamat ${greetingTime}, ${userRole} 👋`;
  const secondaryTextColor = theme.dark ? '#A0AEC0' : '#718096';

  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsData, setStatsData] = useState<any[] | null>(null);

  const [isLoadingFormProgress, setIsLoadingFormProgress] = useState(true);
  const [formProgressData, setFormProgressData] = useState<any | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoadingStats(true);
    setIsLoadingFormProgress(true);
    await new Promise(resolve => setTimeout(resolve, 1800)); // Durasi loading sedikit lebih lama untuk demo skeleton

    setStatsData([{ value: 50 }, { value: 80 }]);
    setFormProgressData({ completed: 75, pending: 25 });

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
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
          <StatsCard theme={theme} type="formulir" />
          <StatsCard theme={theme} type="desa" />
          <StatsCard theme={theme} type="kecamatan" />
          <StatsCard theme={theme} type="pengguna" />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Visualisasi Data</Text>

        <View style={styles.chartsContainer}>
          {isLoadingFormProgress ? (
            <ChartSkeleton theme={theme} height={180} /> // Menggunakan ChartSkeleton
          ) : formProgressData ? (
            <FormProgressChart theme={theme} data={formProgressData} />
          ) : (
            <DataPlaceholder message="Data Progres Formulir Belum Tersedia" theme={theme}/>
          )}

          <View style={{ height: 24 }} />

          {isLoadingStats ? (
            <ChartSkeleton theme={theme} height={220} /> // Menggunakan ChartSkeleton
          ) : statsData && statsData.length > 0 ? (
            <StatsChart theme={theme} data={statsData} />
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
  // loadingIndicator: ViewStyle; // Dihapus
  dataPlaceholderContainer: ViewStyle;
  dataPlaceholderText: TextStyle;
  skeletonItem: ViewStyle; // Ditambahkan untuk skeleton
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
    lineHeight: SUBHEADING_FONT_SIZE * 1.5,
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
  // loadingIndicator: {}, // Dihapus
  dataPlaceholderContainer: {
    minHeight: 150,
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 10,
  },
  dataPlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  skeletonItem: { // Style untuk item skeleton
    borderRadius: 12, // Samakan dengan gaya kartu atau chart Anda
    width: '100%', // Mengambil lebar penuh container
    marginBottom: 20, // Jarak jika ada beberapa skeleton atau elemen lain
    // backgroundColor dan height diatur inline
  },
});