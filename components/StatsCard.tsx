import React from 'react';
import { View, Text, StyleSheet, Dimensions, ViewStyle, TextStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { Theme } from '@react-navigation/native'; // Impor tipe Theme

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string; // Warna aksen untuk ikon dan latar belakangnya
  theme: Theme; // Tambahkan prop theme
}

const StatsCard = ({ title, value, icon: Icon, color, theme }: StatsCardProps) => {
  const { colors, dark: isDarkMode } = theme; // Dapatkan colors dan status dark mode dari theme

  // Warna teks sekunder berdasarkan mode
  const cardTitleColor = isDarkMode ? '#9ca3af' : '#6b7280'; // gray-400 untuk dark, gray-500 untuk light
  // Warna bayangan yang lebih lembut untuk dark mode
  const shadowColor = isDarkMode ? '#050505' : '#000';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card, // Latar belakang kartu dari theme
          shadowColor: shadowColor, // Warna bayangan dinamis
        },
      ]}>
      {/* Latar belakang iconBox menggunakan warna aksen dengan opacity, ini seharusnya baik-baik saja */}
      <View style={[styles.iconBox, { backgroundColor: `${color}1A` }]}>
        {/* Warna ikon tetap menggunakan prop 'color' sebagai aksen */}
        <Icon color={color} size={22} />
      </View>
      <View style={styles.textWrapper}>
        <Text
          style={[styles.cardTitle, { color: cardTitleColor }]}
          numberOfLines={2}
          ellipsizeMode="tail">
          {title}
        </Text>
        {/* Warna nilai kartu menggunakan warna teks utama dari theme */}
        <Text style={[styles.cardValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
};

export default StatsCard;

interface Style {
  card: ViewStyle;
  iconBox: ViewStyle;
  textWrapper: ViewStyle;
  cardTitle: TextStyle;
  cardValue: TextStyle;
}

const CARD_WIDTH = (Dimensions.get('window').width - 60) / 2; // (paddingLayar * 2 + gapAntarCard) / 2

const styles = StyleSheet.create<Style>({
  card: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: akan diatur oleh theme
    padding: 14,
    borderRadius: 14,
    // shadowColor: akan diatur oleh theme
    shadowOpacity: 0.04, // Opacity bisa tetap, atau disesuaikan jika perlu
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
    // color: akan diatur oleh theme
    marginBottom: 2,
    flexShrink: 1,
    fontFamily: 'Poppins-Regular',
  },
  cardValue: {
    fontSize: 16,
    // color: akan diatur oleh theme
    fontFamily: 'Poppins-SemiBold',
  },
});
