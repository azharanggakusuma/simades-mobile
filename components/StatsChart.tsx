// components/VisitorChart.js
import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function VisitorChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        data: [640, 720, 680, 530, 450, 390, 410, 430, 520, 670, 730, 790],
        color: () => '#3b82f6',
        strokeWidth: 2,
      },
    ],
    legend: ['Jumlah Pengunjung per Bulan'],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: () => '#3b82f6',
    labelColor: () => '#6b7280',
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#3b82f6',
    },
    propsForBackgroundLines: {
      stroke: '#e5e7eb',
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grafik Pengunjung</Text>
      <LineChart
        data={data}
        width={screenWidth - 40}
        height={240}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withVerticalLabels
        withHorizontalLabels
        fromZero
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 70,
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    paddingVertical: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#111827',
    textAlign: 'center',
  },
  chart: {
    borderRadius: 14,
  },
});
