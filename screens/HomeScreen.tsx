import React, { useState } from 'react';
import { Text, View, ScrollView, StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';
import StatsChart from '../components/StatsChart';
import MiniCard from '../components/MiniCard';
import { FileText, Building, MapPin, Users } from 'lucide-react-native';
import FormProgressChart from '../components/FormProgressChart';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Dashboard</Text>
        <Text style={styles.subheading}>Selamat datang kembali 👋</Text>

        <View style={styles.grid}>
          <MiniCard title="Formulir" value="16" icon={FileText} color="#6366f1" />
          <MiniCard title="Desa" value="424" icon={Building} color="#10b981" />
          <MiniCard title="Kecamatan" value="40" icon={MapPin} color="#f59e0b" />
          <MiniCard title="Pengguna" value="425" icon={Users} color="#ef4444" />
        </View>
        
        <FormProgressChart />
        <StatsChart />
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

const styles = StyleSheet.create<Style>({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  subheading: {
    fontSize: 14,
    color: '#6b7280',
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
