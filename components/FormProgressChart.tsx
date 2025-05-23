// components/StatsChart.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function FormProgressChart() {
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
          <Text style={styles.badgeText}>{unfilled}% Belum</Text>
        </View>
      </View>

      {/* Pie Chart */}
      <View style={styles.chartWrapper}>
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
          hasLegend={false}
          absolute
          style={styles.chart}
        />
      </View>

      {/* Custom Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.legendText}>Sudah Mengisi</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
          <Text style={styles.legendText}>Belum Mengisi</Text>
        </View>
      </View>
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
    marginBottom: 100,
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
    color: '#111827',
    fontFamily: 'Poppins-Regular',
  },
});
