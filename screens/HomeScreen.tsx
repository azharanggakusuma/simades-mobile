import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsChart from '../components/StatsChart';
import { Ionicons } from '@expo/vector-icons';

interface MiniCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.screen}>
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

function MiniCard({ title, value, icon, color }: MiniCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: `${color}1A` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );
}

interface Style {
  screen: ViewStyle;
  container: ViewStyle;
  heading: TextStyle;
  subheading: TextStyle;
  grid: ViewStyle;
  card: ViewStyle;
  iconBox: ViewStyle;
  textWrapper: ViewStyle;
  cardTitle: TextStyle;
  cardValue: TextStyle;
}

const CARD_WIDTH = (Dimensions.get('window').width - 60) / 2;

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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  card: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    columnGap: 12,
  },
  iconBox: {
    padding: 10,
    borderRadius: 10,
  },
  textWrapper: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
    flexShrink: 1,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
});
