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
  Award, // Contoh ikon untuk peran
} from 'lucide-react-native';

interface ProfileScreenProps {
  navigation: any;
}

// Data pengguna dummy
const DUMMY_USER = {
  name: 'Azharangga Kusuma',
  role: 'Administrator', // Atau 'Petugas', dll.
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { colors, dark: isDarkMode }: Theme = useTheme();

  // Handler Aksi (tetap sama)
  const handleEditProfile = () => navigation.navigate('EditProfileScreen');
  const handleSettings = () => navigation.navigate('SettingsScreen');
  const handleNotifications = () => navigation.navigate('NotificationSettingsScreen');
  const handleHelp = () => navigation.navigate('HelpScreen');
  const handlePrivacyPolicy = () => navigation.navigate('PrivacyPolicyScreen');
  const handleMyActivity = () => navigation.navigate('MyActivityScreen');
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
            // navigation.replace('AuthStack');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const iconColorDefault = isDarkMode ? colors.text : '#4A5568';
  const chevronColor = isDarkMode ? colors.border : '#CBD5E0';

  const menuItems = [
    { id: 'editProfile', label: 'Informasi Akun', icon: Edit3, onPress: handleEditProfile },
    { id: 'myActivity', label: 'Aktivitas Saya', icon: ListChecks, onPress: handleMyActivity },
    { id: 'notifications', label: 'Notifikasi', icon: Bell, onPress: handleNotifications },
    { id: 'settings', label: 'Pengaturan', icon: Settings, onPress: handleSettings },
    { id: 'privacy', label: 'Kebijakan Privasi', icon: ShieldCheck, onPress: handlePrivacyPolicy },
    { id: 'help', label: 'Bantuan & Dukungan', icon: HelpCircle, onPress: handleHelp },
  ];

  const logoutItem = {
    id: 'logout',
    label: 'Keluar Akun',
    icon: LogOut,
    onPress: handleLogout,
    color: isDarkMode ? '#FFA7A7' : '#E53E3E',
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollViewContent: {
      paddingBottom: 30,
    },
    profileHeader: {
      alignItems: 'center',
      paddingTop: Platform.OS === 'ios' ? 40 : 50,
      paddingBottom: 20,
      paddingHorizontal: 24,
    },
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: isDarkMode ? colors.card : `${colors.primary}1A`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      borderWidth: 1.5,
      borderColor: isDarkMode ? colors.border : colors.primary,
    },
    userName: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginBottom: 4, // Jarak ke peran lebih dekat
      textAlign: 'center',
    },
    userRole: { // Style baru untuk peran pengguna
      fontSize: 14,
      fontFamily: 'Poppins-Medium', // Sedikit lebih tebal untuk menandakan peran
      color: colors.primary, // Gunakan warna primer untuk menonjolkan peran
      marginBottom: 12, // Jarak setelah peran
      textAlign: 'center',
      // textTransform: 'capitalize', // Opsional: Administrator, Petugas
    },
    userRoleContainer: { // Opsional: jika ingin menambahkan ikon di sebelah peran
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    userRoleTextWithIcon: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: colors.primary,
        marginLeft: 6, // Jarak dari ikon peran
        textAlign: 'center',
    },
    menuContainer: {
      paddingHorizontal: 18,
      marginTop: 20, // Jarak dari header ke menu
    },
    menuSection: {},
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      paddingHorizontal: 12,
    },
    menuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuItemText: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      marginLeft: 20,
      color: colors.text,
    },
    logoutButtonContainer: {
      marginBottom: 120,
      paddingHorizontal: 18,
    },
    logoutMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 12,
    }
  });

  const renderMenuItem = (item: typeof menuItems[0] | typeof logoutItem, isLogout = false) => {
    const IconComponent = item.icon;
    const itemTextColor = item.color || colors.text;
    const itemIconColor = item.color || iconColorDefault;

    return (
      <TouchableOpacity
        key={item.id}
        onPress={item.onPress}
        style={isLogout ? styles.logoutMenuItem : styles.menuItem}
        activeOpacity={0.6}
      >
        <View style={styles.menuItemContent}>
          <IconComponent
            size={22}
            color={itemIconColor}
          />
          <Text style={[styles.menuItemText, { color: itemTextColor }]}>
            {item.label}
          </Text>
        </View>
        {!isLogout && (
          <ChevronRight size={20} color={chevronColor} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <UserRound size={50} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{DUMMY_USER.name}</Text>
          {/* Menampilkan peran pengguna */}
          <View style={styles.userRoleContainer}>
            <Award size={16} color={colors.primary} strokeWidth={2.5} /> {/* Contoh ikon untuk peran */}
            <Text style={styles.userRoleTextWithIcon}>{DUMMY_USER.role}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <View style={styles.menuSection}>
            {menuItems.map((item) => renderMenuItem(item))}
          </View>
        </View>

        <View style={styles.logoutButtonContainer}>
            {renderMenuItem(logoutItem, true)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;