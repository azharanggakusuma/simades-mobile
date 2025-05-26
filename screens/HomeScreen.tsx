import React from 'react';
import { Text, View, ScrollView, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native'; // Impor useTheme
import StatsChart from '../components/VisitorsChart';
import StatsCard from '../components/StatsCard';
import { FileText, Building, MapPin, Users } from 'lucide-react-native';
import FormProgressChart from '../components/FormProgressChart';

export default function HomeScreen() {
  const theme = useTheme(); // Gunakan hook useTheme
  const { colors } = theme; // Destructure colors dari theme

  // Definisikan warna sekunder berdasarkan mode tema
  const secondaryTextColor = theme.dark ? '#9ca3af' : '#6b7280'; // gray-400 untuk dark, gray-500 untuk light

  return (
    // Gunakan colors.background untuk latar belakang layar
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Gunakan colors.text untuk teks utama */}
        <Text style={[styles.heading, { color: colors.text }]}>Dashboard</Text>
        {/* Gunakan secondaryTextColor untuk sub-judul */}
        <Text style={[styles.subheading, { color: secondaryTextColor }]}>
          Selamat datang kembali 👋
        </Text>

        <View style={styles.grid}>
          {/* Teruskan prop 'theme' ke StatsCard */}
          <StatsCard theme={theme} title="Formulir" value="16" icon={FileText} color="#6366f1" />
          <StatsCard theme={theme} title="Desa" value="424" icon={Building} color="#10b981" />
          <StatsCard theme={theme} title="Kecamatan" value="40" icon={MapPin} color="#f59e0b" />
          <StatsCard theme={theme} title="Pengguna" value="425" icon={Users} color="#ef4444" />
        </View>

        {/* Teruskan prop 'theme' ke FormProgressChart dan StatsChart */}
        <FormProgressChart theme={theme} />
        <StatsChart theme={theme} />
      </ScrollView>
    </View>
  );
}

interface Style {
  screen: ViewStyle;
  container: ViewStyle;
  heading: TextStyle;
  subheading: TextStyle;
  grid: ViewStyle;
}

// StyleSheet tetap sama, warna akan di-override atau ditambahkan secara inline dari theme
const styles = StyleSheet.create<Style>({
  screen: {
    flex: 1,
    // backgroundColor akan diatur oleh theme
  },
  container: {
    padding: 20,
    paddingBottom: 40, // Sesuaikan jika BottomNav overlay konten
  },
  heading: {
    fontSize: 22,
    // color akan diatur oleh theme
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  subheading: {
    fontSize: 14,
    // color akan diatur oleh theme
    marginBottom: 25,
    fontFamily: 'Poppins-Regular',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
});
