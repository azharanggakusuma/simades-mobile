import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import {
  ChevronRight,
  Bell,
  Globe,
  UserCog,
  ShieldCheck,
  FileText,
  Info,
  Palette,
  HelpCircle,
} from 'lucide-react-native';

// --- Konstanta Global ---
const DARK_MODE_YELLOW_ACCENT = '#FACC15'; // Kuning untuk ikon di dark mode

// --- Types & Interfaces ---
interface SettingItemBase {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
}

interface NavigationalSetting extends SettingItemBase {
  type: 'navigate';
  onPress: () => void;
}

interface SwitchSetting extends SettingItemBase {
  type: 'switch';
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface InfoSetting extends SettingItemBase {
  type: 'info';
  infoText: string;
}

type SettingItem = NavigationalSetting | SwitchSetting | InfoSetting;

interface SettingsSectionConfig {
  title: string;
  items: SettingItem[];
}

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const { colors, dark: isDarkMode }: Theme = useTheme();

  // --- State untuk Pengaturan (Contoh) ---
  const [isThemeSwitchEnabled, setIsThemeSwitchEnabled] = useState(isDarkMode);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // --- Handlers ---
  const handleThemeToggle = (value: boolean) => {
    setIsThemeSwitchEnabled(value);
    Alert.alert("Mode Tampilan", `Fitur ini akan mengubah tema aplikasi. (Implementasi global diperlukan)`);
  };

  const handleNotificationChange = (value: boolean) => {
    setNotificationsEnabled(value);
  };

  const navigateToPlaceholder = (screenName: string, featureName?: string) => {
    Alert.alert(
      featureName || screenName,
      `Fitur atau halaman "${featureName || screenName}" belum diimplementasikan.`
    );
  };
  
  // --- Warna yang Didefinisikan untuk Konsistensi ---
  // Warna ikon default: KUNING di dark mode, abu-abu di light mode
  const defaultSettingIconColor = isDarkMode ? DARK_MODE_YELLOW_ACCENT : '#6B7280'; // gray-500 untuk light
  // Warna background tint untuk kontainer ikon
  const iconContainerBackgroundColor = isDarkMode ? `${DARK_MODE_YELLOW_ACCENT}2A` : `${'#6B7280'}1A`;

  // Warna teks sekunder: PUTIH (atau abu-abu sangat terang) di dark mode, abu-abu di light mode
  const secondaryTextColor = isDarkMode ? '#E5E7EB' : '#6B7280'; // gray-200 untuk dark, gray-500 untuk light

  // Warna track switch
  const switchActiveTrackColor = colors.primary; // ASUMSI colors.primary BUKAN MERAH
  const switchInactiveTrackColor = isDarkMode ? '#374151' : '#E5E7EB';
  const switchAndroidThumbColor = (isActive: boolean) => 
    isActive ? (isDarkMode ? colors.primary : colors.card) : (isDarkMode ? '#4B5563' : '#f4f3f4');


  // --- Konfigurasi Item Pengaturan ---
  const settingsSections: SettingsSectionConfig[] = [
    {
      title: 'Tampilan & Preferensi',
      items: [
        { 
          type: 'navigate', 
          id: 'themeSettings', 
          label: 'Mode Tampilan', 
          icon: Palette, 
          onPress: () => navigateToPlaceholder('ThemeSelectionScreen', 'Pemilihan Tema'), 
          description: `Saat ini: ${isDarkMode ? 'Gelap' : 'Terang'}`
        },
        { 
          type: 'switch', 
          id: 'notifications', 
          label: 'Notifikasi Aplikasi', 
          icon: Bell, 
          value: notificationsEnabled, 
          onValueChange: handleNotificationChange 
        },
        { 
          type: 'navigate', 
          id: 'language', 
          label: 'Bahasa', 
          icon: Globe, 
          onPress: () => navigateToPlaceholder('LanguageSelectionScreen', 'Pemilihan Bahasa'),
          description: 'Indonesia'
        },
      ],
    },
    {
      title: 'Akun & Keamanan',
      items: [
        { type: 'navigate', id: 'account', label: 'Profil & Akun Saya', icon: UserCog, onPress: () => navigateToPlaceholder('ProfileDetailScreen', 'Profil & Akun Saya') },
        { type: 'navigate', id: 'privacy', label: 'Kebijakan Privasi', icon: ShieldCheck, onPress: () => navigateToPlaceholder('PrivacyPolicyScreen') },
        { type: 'navigate', id: 'terms', label: 'Ketentuan Layanan', icon: FileText, onPress: () => navigateToPlaceholder('TermsScreen') },
      ],
    },
    {
      title: 'Tentang Aplikasi',
      items: [
        { type: 'info', id: 'version', label: 'Versi Aplikasi', icon: Info, infoText: '1.0.0' },
        { type: 'navigate', id: 'help', label: 'Bantuan & FAQ', icon: HelpCircle, onPress: () => navigateToPlaceholder('HelpScreen') },
      ],
    },
  ];

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    scrollView: { flex: 1 },
    scrollViewContent: { paddingBottom: 40, paddingTop: Platform.OS === 'ios' ? 0 : 10 },
    screenHeaderContainer: {
      paddingHorizontal: 24,
      paddingBottom: 20,
      paddingTop: Platform.OS === 'ios' ? 10 : 20,
    },
    screenHeaderTitle: {
      fontSize: 24,
      fontFamily: 'Poppins-Bold',
      color: colors.text, // Akan putih di dark mode jika tema diatur benar
    },
    sectionTitleText: {
      fontSize: 14,
      fontFamily: 'Poppins-SemiBold',
      color: secondaryTextColor, // Menggunakan secondaryTextColor
      paddingHorizontal: 24,
      marginTop: 16,
      marginBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingsItemsCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginHorizontal: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.1 : 0.05,
      shadowRadius: 2,
      elevation: isDarkMode ? 1 : 2,
    },
    settingItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 16,
    },
    itemIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: iconContainerBackgroundColor, // Menggunakan warna background tint ikon
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    itemTextDetailsContainer: {
      flex: 1,
    },
    itemLabelText: {
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
      color: colors.text, // Akan putih di dark mode
    },
    itemDescriptionText: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: secondaryTextColor, // Menggunakan secondaryTextColor
      marginTop: 2,
    },
    itemRightActionContainer: {
      paddingLeft: 10,
    },
    infoValueText: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: secondaryTextColor, // Menggunakan secondaryTextColor
    },
    rowSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginLeft: 16 + 36 + 16, 
    },
  });

  const renderSettingItem = (item: SettingItem, isLast: boolean) => {
    const Icon = item.icon;
    return (
      <View key={item.id}>
        <TouchableOpacity
          style={styles.settingItemRow}
          onPress={item.type === 'navigate' ? item.onPress : undefined}
          activeOpacity={item.type === 'navigate' ? 0.6 : 1}
          disabled={item.type !== 'navigate'}
        >
          <View style={styles.itemIconContainer}>
            <Icon size={20} color={defaultSettingIconColor} strokeWidth={1.8} /> 
          </View>
          <View style={styles.itemTextDetailsContainer}>
            <Text style={styles.itemLabelText}>{item.label}</Text>
            {item.description && <Text style={styles.itemDescriptionText}>{item.description}</Text>}
          </View>
          <View style={styles.itemRightActionContainer}>
            {item.type === 'navigate' && <ChevronRight size={20} color={colors.border} />}
            {item.type === 'switch' && (
              <Switch
                value={item.value}
                onValueChange={item.onValueChange}
                trackColor={{ false: switchInactiveTrackColor, true: switchActiveTrackColor }}
                thumbColor={Platform.OS === 'android' ? switchAndroidThumbColor(item.value) : undefined}
                ios_backgroundColor={switchInactiveTrackColor}
              />
            )}
            {item.type === 'info' && <Text style={styles.infoValueText}>{item.infoText}</Text>}
          </View>
        </TouchableOpacity>
        {!isLast && <View style={styles.rowSeparator} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.screenHeaderContainer}>
          <Text style={styles.screenHeaderTitle}>Pengaturan</Text>
        </View>

        {settingsSections.map((section) => (
          <View key={section.title}>
            <Text style={styles.sectionTitleText}>{section.title}</Text>
            <View style={styles.settingsItemsCard}>
              {section.items.map((item, index) => 
                renderSettingItem(item, index === section.items.length - 1)
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;