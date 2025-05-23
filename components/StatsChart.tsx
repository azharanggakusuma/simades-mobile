import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function StatsChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        data: [180, 52, 60, 40, 90, 50, 40, 52, 90, 80, 60, 70],
        color: () => '#3b82f6',
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: () => '#3b82f6',
    labelColor: () => '#6b7280',
    propsForDots: {
      r: '3',
      strokeWidth: '1',
      stroke: '#3b82f6',
    },
    propsForBackgroundLines: {
      stroke: '#e5e7eb',
    },
    fillShadowGradient: '#93c5fd',
    fillShadowGradientOpacity: 0.3,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Pengunjung</Text>
          <Text style={styles.total}>2.3k</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>↓ 4%</Text>
        </View>
      </View>

      <LineChart
        data={data}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          ...chartConfig,
          paddingLeft: 0,
        }}
        withVerticalLabels={true}
        withHorizontalLabels
        withInnerLines
        withOuterLines={false}
        fromZero
        bezier
        style={[styles.chart, { marginLeft: -25, marginTop: 8 }]}
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
    overflow: 'hidden',
    marginBottom: 120,
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
    backgroundColor: '#fee2e2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeText: {
    color: '#b91c1c',
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  chart: {
    borderRadius: 8,
  },
});
