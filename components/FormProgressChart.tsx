import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import type { Theme } from '@react-navigation/native'; // Impor tipe Theme

const screenWidth = Dimensions.get('window').width;

// Definisikan warna aksen yang konsisten
const yellowAccent = '#f59e0b'; // Warna kuning untuk "Belum Mengisi"
const greenAccent = '#10b981'; // Warna hijau untuk "Sudah Mengisi"
const darkYellowBadgeBackground = '#4B3200'; // Latar belakang badge kuning untuk dark mode
const lightYellowBadgeBackground = '#fef3c7'; // Latar belakang badge kuning untuk light mode
const darkYellowBadgeText = yellowAccent; // Teks badge kuning untuk dark mode
const lightYellowBadgeText = '#b45309'; // Teks badge kuning untuk light mode

interface FormProgressChartProps {
  theme: Theme; // Tambahkan prop theme
}

export default function FormProgressChart({ theme }: FormProgressChartProps) {
  const { colors, dark: isDarkMode } = theme; // Dapatkan colors dan status dark mode

  const totalDesa = 424;
  const sudahMengisi = 320;
  const belumMengisi = totalDesa - sudahMengisi;

  const percentFilled = Math.round((sudahMengisi / totalDesa) * 100);
  const percentUnfilled = 100 - percentFilled;

  // Warna teks sekunder berdasarkan mode
  const secondaryTextColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const shadowColor = isDarkMode ? '#050505' : '#000';

  const data = [
    {
      name: 'Sudah Mengisi',
      population: sudahMengisi,
      color: greenAccent, // Warna slice chart tetap
      legendFontColor: colors.text, // Warna teks legenda dari theme
      legendFontSize: 12,
    },
    {
      name: 'Belum Mengisi',
      population: belumMengisi,
      color: yellowAccent, // Warna slice chart tetap
      legendFontColor: colors.text, // Warna teks legenda dari theme
      legendFontSize: 12,
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card, // Latar belakang dari theme
          shadowColor: shadowColor,
        },
      ]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.label, { color: secondaryTextColor }]}>Progress Pengisian</Text>
          <Text style={[styles.total, { color: colors.text }]}>{percentFilled}%</Text>
          <Text style={[styles.subText, { color: secondaryTextColor }]}>
            {sudahMengisi} dari {totalDesa} desa
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: isDarkMode ? darkYellowBadgeBackground : lightYellowBadgeBackground,
            },
          ]}>
          <Text
            style={[
              styles.badgeText,
              { color: isDarkMode ? darkYellowBadgeText : lightYellowBadgeText },
            ]}>
            {percentUnfilled}% Belum
          </Text>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <PieChart
          data={data}
          width={screenWidth - 32} // (padding container * 2)
          height={220}
          chartConfig={{
            // Properti color di chartConfig ini mungkin tidak banyak berpengaruh karena warna diatur per data item
            // Namun, untuk konsistensi, bisa diatur ke warna teks tema.
            color: (opacity = 1) =>
              isDarkMode ? `rgba(229, 229, 231, ${opacity})` : `rgba(17, 24, 39, ${opacity})`,
            // ... properti chartConfig lainnya jika ada (misal: labelColor)
          }}
          accessor="population"
          backgroundColor="transparent" // Latar belakang chart transparan karena container sudah diatur
          paddingLeft="0" // Sesuaikan padding ini jika chart tidak terpusat dengan baik
          center={[0, 0]} // Penyesuaian posisi chart, mungkin perlu disesuaikan
          hasLegend={false} // Legenda kustom digunakan
          absolute // Menampilkan nilai absolut
          style={styles.chart}
        />
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: greenAccent }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Sudah Mengisi</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: yellowAccent }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Belum Mengisi</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: akan diatur oleh theme
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    // shadowColor: akan diatur oleh theme
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    // color: akan diatur oleh theme
    fontFamily: 'Poppins-Regular',
  },
  total: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    // color: akan diatur oleh theme
  },
  subText: {
    fontSize: 12,
    // color: akan diatur oleh theme
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  badge: {
    // backgroundColor: akan diatur oleh theme
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeText: {
    // color: akan diatur oleh theme
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  chartWrapper: {
    paddingLeft: 65,
  },
  chart: {
    borderRadius: 8,
    marginBottom: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 8,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    // color: akan diatur oleh theme
    fontFamily: 'Poppins-Regular',
  },
});
