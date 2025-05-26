import React from 'react';
import { Text, View, ScrollView, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import StatsChart from '../components/VisitorsChart';
import StatsCard from '../components/StatsCard';
import FormProgressChart from '../components/FormProgressChart';

export default function HomeScreen() {
  const theme = useTheme();
  const { colors } = theme;

  const secondaryTextColor = theme.dark ? '#9ca3af' : '#6b7280';

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.heading, { color: colors.text }]}>Dashboard</Text>
        <Text style={[styles.subheading, { color: secondaryTextColor }]}>
          Selamat datang kembali 👋
        </Text>

        <View style={styles.grid}>
          {/* Panggil StatsCard hanya dengan tipe dan theme */}
          <StatsCard theme={theme} type="formulir" />
          <StatsCard theme={theme} type="desa" />
          <StatsCard theme={theme} type="kecamatan" />
          <StatsCard theme={theme} type="pengguna" />
        </View>

        <FormProgressChart theme={theme} />
        <StatsChart theme={theme} />
      </ScrollView>
    </View>
  );
}

// Interface dan Stylesheet di HomeScreen tetap sama
interface Style {
  screen: ViewStyle;
  container: ViewStyle;
  heading: TextStyle;
  subheading: TextStyle;
  grid: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  screen: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  subheading: {
    fontSize: 14,
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