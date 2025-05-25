import React from 'react';
import { RefreshControl as RNRefreshControl, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native'; // Sesuaikan path

interface GlobalRefreshControlProps {
  refreshing: boolean;
  onRefresh: () => void;
  // Props opsional untuk override warna default jika diperlukan pada kasus tertentu
  customTintColor?: string;
  customColors?: string[];
  customProgressBackgroundColor?: string;
}

const GlobalRefreshControl: React.FC<GlobalRefreshControlProps> = ({
  refreshing,
  onRefresh,
  customTintColor,
  customColors,
  customProgressBackgroundColor,
}) => {
  const { colors: themeColors, dark: isDarkMode }: Theme = useTheme();

  // Skema warna biru/kuning global Anda
  const accentBlue = Platform.OS === 'ios' ? '#007AFF' : '#1E88E5';
  const accentYellow = '#FACC15';
  const currentAccentColor = isDarkMode ? accentYellow : accentBlue;

  // Warna default untuk RefreshControl
  const tintColor = customTintColor || currentAccentColor; // Untuk iOS
  const androidSpinnerColors = customColors || [currentAccentColor, themeColors.primary]; // Untuk Android (bisa array warna)
  const progressBackgroundColor = customProgressBackgroundColor || themeColors.card; // Latar belakang spinner di Android

  return (
    <RNRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={tintColor} // iOS
      colors={androidSpinnerColors} // Android
      progressBackgroundColor={progressBackgroundColor} // Android
      // title="Memuat ulang..." // Opsional: teks di iOS
      // titleColor={themeColors.text} // Opsional: warna teks di iOS
    />
  );
};

export default GlobalRefreshControl;