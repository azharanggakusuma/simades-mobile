import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import {
  UserRound, 
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit3,
  ShieldCheck,
  ListChecks,
  Award,
} from 'lucide-react-native';

interface ProfileScreenProps {
  navigation: any;
}

// Data pengguna dummy
const user = {
  name: 'Azharangga Kusuma',
  role: 'Administrator',
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { colors, dark: isDarkMode }: Theme = useTheme();

  // Handler Aksi dengan navigasi dikomentari
  const handleEditProfile = () => {
    Alert.alert("Informasi Akun", "Aksi untuk edit profil."); // Pesan bisa disesuaikan
    // navigation.navigate('EditProfileScreen'); 
  };
  const handleSettings = () => {
    Alert.alert("Pengaturan Aplikasi", "Aksi untuk pengaturan aplikasi.");
    // navigation.navigate('SettingsScreen');
  };
  const handleNotifications = () => {
    Alert.alert("Notifikasi", "Aksi untuk pengaturan notifikasi.");
    // navigation.navigate('NotificationSettingsScreen');
  };
  const handleHelp = () => {
    Alert.alert("Bantuan & Dukungan", "Aksi untuk bantuan & dukungan.");
    // navigation.navigate('HelpScreen');
  };
  const handlePrivacyPolicy = () => {
    Alert.alert("Kebijakan Privasi", "Aksi untuk kebijakan privasi.");
    // navigation.navigate('PrivacyPolicyScreen');
  };
  const handleMyActivity = () => {
    Alert.alert("Aktivitas Saya", "Aksi untuk aktivitas saya.");
    // navigation.navigate('MyActivityScreen');
  };
  const handleLogout = () => {
    Alert.alert(
      'Keluar Akun',
      'Apakah Anda yakin ingin keluar dari sesi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => {
            console.log('Pengguna telah keluar');
            // Implementasi logika keluar, misal: 
            // navigation.replace('AuthStack'); 
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Warna ikon default (sesuai kode asli Anda)
  const defaultIconColor = isDarkMode ? colors.text : '#4A5568'; 
  const chevronColor = isDarkMode ? colors.border : '#A0AEC0';

  const menuItemsConfig = [
    { id: 'editProfile', label: 'Informasi Akun', icon: Edit3, onPress: handleEditProfile },
    { id: 'myActivity', label: 'Aktivitas Saya', icon: ListChecks, onPress: handleMyActivity },
    { id: 'notifications', label: 'Notifikasi', icon: Bell, onPress: handleNotifications },
    { id: 'settings', label: 'Pengaturan Aplikasi', icon: Settings, onPress: handleSettings },
    { id: 'privacy', label: 'Kebijakan Privasi', icon: ShieldCheck, onPress: handlePrivacyPolicy },
    { id: 'help', label: 'Bantuan & Dukungan', icon: HelpCircle, onPress: handleHelp },
    { 
      id: 'logout', 
      label: 'Keluar Akun', 
      icon: LogOut, 
      onPress: handleLogout, 
      color: isDarkMode ? '#FCA5A5' : '#E53E3E',
      isLogout: true 
    },
  ];

  const avatarIconColor = isDarkMode ? ( (colors.primary === '#FACC15' || colors.primary === '#fde047') ? '#1F2937' : colors.card ) : colors.card ;


  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollViewContent: {
      paddingBottom: 40,
    },
    profileHeader: {
      alignItems: 'center',
      paddingTop: Platform.OS === 'ios' ? 30 : 40,
      paddingBottom: 30,
      paddingHorizontal: 24,
      backgroundColor: colors.background,
    },
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      borderWidth: 3,
      borderColor: colors.card, 
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    userName: {
      fontSize: 22,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
      marginBottom: 6,
      textAlign: 'center',
    },
    userRoleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: `${colors.primary}20`,
      marginTop: 4,
    },
    userRoleTextWithIcon: {
      fontSize: 14,
      fontFamily: 'Poppins-Medium',
      color: colors.primary,
      marginLeft: 6,
      textAlign: 'center',
    },
    menuCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginHorizontal: 16,
      marginTop: 10, // Dari kode Anda, saya sesuaikan dengan desain sebelumnya yang menuCard-nya sedikit lebih jauh dari header
      paddingVertical: 8,
      elevation: isDarkMode ? 2 : 4,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.1 : 0.08,
      shadowRadius: 5,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      paddingHorizontal: 20,
    },
    menuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuItemText: {
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
      marginLeft: 18,
      color: colors.text,
    },
    menuItemSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginHorizontal: 20,
    },
    logoutMenuItemText: {
        fontFamily: 'Poppins-SemiBold',
    }
  });

  const renderMenuItem = (item: typeof menuItemsConfig[0], index: number, totalItems: number) => {
    const IconComponent = item.icon;
    const itemTextColor = item.color || colors.text;
    const itemIconColor = item.color || defaultIconColor;
    const isLastItem = index === totalItems - 1;

    return (
      <View key={item.id}>
        <TouchableOpacity
          onPress={item.onPress}
          style={styles.menuItem}
          activeOpacity={0.65}
        >
          <View style={styles.menuItemContent}>
            <IconComponent
              size={22}
              color={itemIconColor}
              strokeWidth={item.isLogout ? 2.5 : 2}
            />
            <Text style={[
                styles.menuItemText, 
                { color: itemTextColor },
                item.isLogout && styles.logoutMenuItemText
            ]}>
              {item.label}
            </Text>
          </View>
          {!item.isLogout && (
            <ChevronRight size={20} color={chevronColor} />
          )}
        </TouchableOpacity>
        {!isLastItem && <View style={styles.menuItemSeparator} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <UserRound 
              size={60}
              color={avatarIconColor}
              strokeWidth={1.5}
            />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.userRoleContainer}>
            <Award size={16} color={colors.primary} strokeWidth={2} />
            <Text style={styles.userRoleTextWithIcon}>{user.role}</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {menuItemsConfig.map((item, index) => renderMenuItem(item, index, menuItemsConfig.length))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;