import React from 'react';
import { View, Text, StyleSheet, Dimensions, ViewStyle, TextStyle } from 'react-native';
import { FileText, Building, MapPin, Users } from 'lucide-react-native'; // Import ikon di sini
import type { LucideIcon } from 'lucide-react-native';
import type { Theme } from '@react-navigation/native';

// 1. Definisikan tipe kartu yang mungkin
export type StatsCardType = 'formulir' | 'desa' | 'kecamatan' | 'pengguna';

// Interface untuk konfigurasi setiap tipe kartu
interface CardSpecificConfig {
  title: string;
  value: string; // Untuk saat ini, nilai kita letakkan di sini. Bisa diubah jadi dinamis nanti.
  icon: LucideIcon;
  color: string; // Warna aksen utama untuk kartu ini
}

// 2. Peta Konfigurasi untuk setiap tipe kartu
const cardConfigurations: Record<StatsCardType, CardSpecificConfig> = {
  formulir: {
    title: "Formulir",
    value: "16", // Contoh nilai
    icon: FileText,
    color: "#6366f1", // Indigo
  },
  desa: {
    title: "Desa",
    value: "424", // Contoh nilai
    icon: Building, // Menggunakan Building untuk Desa agar beda dengan Kecamatan
    color: "#10b981", // Hijau
  },
  kecamatan: {
    title: "Kecamatan",
    value: "40",  // Contoh nilai
    icon: MapPin,   // Menggunakan MapPin untuk Kecamatan
    color: "#f59e0b", // Kuning/Amber
  },
  pengguna: {
    title: "Pengguna",
    value: "425", // Contoh nilai
    icon: Users,
    color: "#ef4444", // Merah
  },
};

// 3. Ubah Props StatsCard
interface StatsCardProps {
  type: StatsCardType; // Prop utama sekarang adalah 'type'
  theme: Theme;
  // Jika nilai ingin dinamis dari HomeScreen, Anda bisa tambahkan prop value opsional:
  // dynamicValue?: string; 
}

const StatsCard = ({ type, theme /*, dynamicValue */ }: StatsCardProps) => {
  const { colors, dark: isDarkMode } = theme;

  // 4. Ambil konfigurasi berdasarkan tipe
  const config = cardConfigurations[type];
  if (!config) {
    // Fallback jika tipe tidak ditemukan, meskipun seharusnya tidak terjadi dengan TypeScript
    return <View><Text>Konfigurasi tidak ditemukan</Text></View>;
  }

  const { title, value: initialValue, icon: Icon, color: accentColor } = config;
  // const displayValue = dynamicValue || initialValue; // Jika ada dynamicValue

  const cardTitleColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const shadowColor = isDarkMode ? '#050505' : '#000';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          shadowColor: shadowColor,
        },
      ]}>
      <View style={[styles.iconBox, { backgroundColor: `${accentColor}1A` }]}>
        <Icon color={accentColor} size={22} />
      </View>
      <View style={styles.textWrapper}>
        <Text
          style={[styles.cardTitle, { color: cardTitleColor }]}
          numberOfLines={2}
          ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={[styles.cardValue, { color: colors.text }]}>
          {initialValue /* Ganti dengan displayValue jika menggunakan dynamicValue */}
        </Text>
      </View>
    </View>
  );
};

export default StatsCard;

// Interface dan Stylesheet tetap sama (tidak ada perubahan signifikan di sini)
interface Style {
  card: ViewStyle;
  iconBox: ViewStyle;
  textWrapper: ViewStyle;
  cardTitle: TextStyle;
  cardValue: TextStyle;
}

const CARD_WIDTH = (Dimensions.get('window').width - 60) / 2;

const styles = StyleSheet.create<Style>({
  card: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
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
    marginBottom: 2,
    flexShrink: 1,
    fontFamily: 'Poppins-Regular',
  },
  cardValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});