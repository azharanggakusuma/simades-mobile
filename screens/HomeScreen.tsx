import React from 'react';
import { Text, View, ScrollView, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
// Impor StatsChart, StatsCard, FormProgressChart seperti sebelumnya
import StatsChart from '../components/VisitorsChart'; // Pastikan path benar
import StatsCard from '../components/StatsCard';     // Pastikan path benar
import FormProgressChart from '../components/FormProgressChart'; // Pastikan path benar

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
  const theme = useTheme();
  const { colors } = theme;

  // Placeholder untuk peran pengguna, ganti dengan data aktual jika ada
  const userRole = 'Admin'; // Contoh: 'Admin', 'Petugas Desa', dll.
  const greetingTime = getTimeBasedGreeting();
  const dynamicSubheading = `Selamat ${greetingTime}, ${userRole} 👋`;

  const secondaryTextColor = theme.dark ? '#A0AEC0' : '#4A5568'; 

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContent}>
            <Text style={[styles.heading, { color: colors.text }]}>Dashboard</Text>
            {/* Menggunakan subheading yang dinamis */}
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
        
        <FormProgressChart theme={theme} />
        <StatsChart theme={theme} /> 
      </ScrollView>
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
  grid: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  screen: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 40,
  },
  headerContent: {
    marginBottom: 28,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
});