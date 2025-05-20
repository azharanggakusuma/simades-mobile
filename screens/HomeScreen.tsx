import React, { useState } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsChart from '../components/StatsChart';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <Navbar
        onMenuPress={() => setSidebarVisible(true)}
        onProfilePress={() => console.log('Profile clicked')}
      />

      {sidebarVisible && <Sidebar onClose={() => setSidebarVisible(false)} />}

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Dashboard</Text>
        <Text style={styles.subheading}>Selamat datang kembali 👋</Text>

        <View style={styles.grid}>
          <MiniCard title="Formulir" value="16" icon="document-text-outline" color="#6366f1" />
          <MiniCard title="Desa/Kelurahan" value="424" icon="business-outline" color="#10b981" />
          <MiniCard title="Kecamatan" value="40" icon="location-outline" color="#f59e0b" />
          <MiniCard title="Pengguna" value="425" icon="people-outline" color="#ef4444" />
        </View>

        <StatsChart />
      </ScrollView>
    </View>
  );
}

function MiniCard({ title, value, icon, color }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrapper, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 25,
  },
  grid: {
    flexDirection: 'column',
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    gap: 16,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 10,
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
});
