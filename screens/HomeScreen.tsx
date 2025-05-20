import React, { useState } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Navbar
        onMenuPress={() => setSidebarVisible(true)}
        onProfilePress={() => console.log('Profile clicked')}
      />

      {sidebarVisible && <Sidebar onClose={() => setSidebarVisible(false)} />}

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Dashboard</Text>
        <Text style={styles.subheading}>Selamat datang kembali 👋</Text>

        <View style={styles.cardsContainer}>
          <DashboardCard icon="document-text-outline" title="Formulir" value="34" color="#4f46e5" />
          <DashboardCard icon="home-outline" title="Desa / Kelurahan" value="76" color="#10b981" />
          <DashboardCard icon="location-outline" title="Kecamatan" value="22" color="#f59e0b" />
          <DashboardCard icon="people-outline" title="Pengguna" value="12" color="#ef4444" />
        </View>
      </ScrollView>
    </View>
  );
}

function DashboardCard({ icon, title, value, color }) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={28} color={color} />
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
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
    color: '#111827',
  },
  subheading: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'column',
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
});
