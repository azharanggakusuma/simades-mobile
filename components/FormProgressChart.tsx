// components/StatsChart.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function StatsChart() {
  const totalForm = 100;
  const filled = 72;
  const unfilled = totalForm - filled;

  const data = [
    {
      name: 'Sudah Mengisi',
      population: filled,
      color: '#10b981',
      legendFontColor: '#111827',
      legendFontSize: 12,
    },
    {
      name: 'Belum Mengisi',
      population: unfilled,
      color: '#f59e0b',
      legendFontColor: '#111827',
      legendFontSize: 12,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Progress Pengisian Formulir</Text>
          <Text style={styles.total}>{filled}% Terisi</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unfilled}% belum</Text>
        </View>
      </View>

      <PieChart
        data={data}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          color: () => '#000',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="0"
        center={[0, 0]}
        absolute
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 80,
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
    color: '#6b7280',
    fontFamily: 'Poppins-Regular',
  },
  total: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeText: {
    color: '#b45309',
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  chart: {
    borderRadius: 8,
  },
});
