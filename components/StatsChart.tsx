import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function StatsChart() {
  const values = [100, 52, 60, 40, 90, 50, 40, 52, 90, 80, 60, 70];
  const total = values.reduce((a, b) => a + b, 0);
  const latest = values.at(-1);
  const previous = values.at(-2);
  const percentageChange = previous ? (((latest - previous) / previous) * 100).toFixed(1) : '0';
  const isNegative = latest < previous;

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        data: values,
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
          <Text style={styles.total}>{formatNumber(total)}</Text>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: isNegative ? '#fee2e2' : '#d1fae5' },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isNegative ? '#b91c1c' : '#047857' },
            ]}
          >
            {isNegative ? '↓' : '↑'} {Math.abs(percentageChange)}%
          </Text>
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  chart: {
    borderRadius: 8,
  },
});
