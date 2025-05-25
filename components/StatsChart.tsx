import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import type { Theme } from '@react-navigation/native'; // Impor tipe Theme

const screenWidth = Dimensions.get('window').width;

// Warna badge dinamis
const badgeColors = {
  light: {
    negativeBg: '#fee2e2', // bg-red-100
    positiveBg: '#d1fae5', // bg-green-100
    negativeText: '#b91c1c', // text-red-700
    positiveText: '#047857', // text-green-700
  },
  dark: {
    negativeBg: '#5A2D2D', // bg-red-900/opacity or custom dark red
    positiveBg: '#1E4E3D', // bg-green-900/opacity or custom dark green
    negativeText: '#FCA5A5', // text-red-300
    positiveText: '#6EE7B7', // text-green-300
  },
};

interface StatsChartProps {
  theme: Theme; // Tambahkan prop theme
}

export default function StatsChart({ theme }: StatsChartProps) {
  const { colors, dark: isDarkMode } = theme;

  const values = [100, 52, 60, 40, 90, 50, 40, 52, 90, 80, 60, 70];
  const total = values.reduce((a, b) => a + b, 0);
  const latest = values.at(-1) || 0; // Tambahkan fallback jika array kosong
  const previous = values.at(-2) || 0; // Tambahkan fallback
  const percentageChange =
    previous !== 0 ? (((latest - previous) / previous) * 100).toFixed(1) : '0';
  const isNegative = latest < previous;

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const currentBadgeSet = isDarkMode ? badgeColors.dark : badgeColors.light;
  const badgeBackgroundColor = isNegative ? currentBadgeSet.negativeBg : currentBadgeSet.positiveBg;
  const badgeTextColor = isNegative ? currentBadgeSet.negativeText : currentBadgeSet.positiveText;

  const secondaryTextColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const shadowColor = isDarkMode ? '#050505' : '#000';
  const lineChartColor = isDarkMode ? colors.primary : '#3b82f6'; // Gunakan primary dari theme untuk dark mode

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        data: values,
        color: () => lineChartColor, // Warna garis chart
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.card, // Latar belakang chart dari theme
    backgroundGradientTo: colors.card, // Latar belakang chart dari theme
    decimalPlaces: 0,
    color: (opacity = 1) => lineChartColor, // Warna utama untuk elemen chart (dot, dll)
    labelColor: (opacity = 1) => secondaryTextColor, // Warna label sumbu
    propsForDots: {
      r: '3',
      strokeWidth: '1',
      stroke: lineChartColor, // Warna outline dot
    },
    // Hapus propsForBackgroundLines atau atur stroke menjadi transparan jika masih ingin menggunakannya untuk tujuan lain
    // propsForBackgroundLines: {
    //   stroke: 'transparent', // Atau colors.border jika ingin garis border tetap ada tapi inner lines hilang
    //   strokeDasharray: '', // Menghilangkan dash jika ada
    // },
    fillShadowGradient: lineChartColor, // Warna area di bawah garis (gunakan warna garis)
    fillShadowGradientOpacity: isDarkMode ? 0.2 : 0.3, // Opacity bisa disesuaikan
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          shadowColor: shadowColor,
        },
      ]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.label, { color: secondaryTextColor }]}>Pengunjung</Text>
          <Text style={[styles.total, { color: colors.text }]}>{formatNumber(total)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeBackgroundColor }]}>
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>
            {isNegative ? '↓' : '↑'} {Math.abs(parseFloat(percentageChange))}%
          </Text>
        </View>
      </View>

      <LineChart
        data={data}
        width={screenWidth - 32} // (padding container * 2)
        height={220}
        chartConfig={chartConfig}
        withVerticalLabels={true} // Tetap tampilkan label vertikal (bulan)
        withHorizontalLabels={true} // Tetap tampilkan label horizontal (nilai)
        withInnerLines={false} // Hilangkan garis bantu dalam chart (jaring horizontal dan vertikal)
        withOuterLines={false} // Hilangkan garis luar chart
        withVerticalLines={false} // Secara eksplisit hilangkan garis vertikal grid
        withHorizontalLines={false} // Secara eksplisit hilangkan garis horizontal grid
        fromZero // Mulai sumbu Y dari nol
        bezier // Kurva halus
        style={[styles.chart, { marginLeft: -25, marginTop: 8 }]} // Mungkin perlu penyesuaian margin
      />
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
    marginBottom: 120, // Sesuaikan jika BottomNav overlay
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
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    // backgroundColor: akan diatur oleh theme
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    // color: akan diatur oleh theme
  },
  chart: {
    borderRadius: 8,
    // margin disesuaikan berdasarkan kebutuhan visual chart
  },
});