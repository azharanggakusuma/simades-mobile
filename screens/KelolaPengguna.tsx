import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Theme } from '@react-navigation/native';
import {
  UserRound,
  ChevronRight,
  Edit3,
  Trash2,
  Plus,
  Users,
} from 'lucide-react-native';

// --- Interface & Types ---
interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
}

// --- Dummy Data Pengguna ---
const DUMMY_USERS_DATA: User[] = [
  { id: 'usr_001', name: 'Azharangga Kusuma', role: 'Administrator', email: 'azhar@example.com' },
  { id: 'usr_002', name: 'Siti Aminah', role: 'Petugas Desa', email: 'siti.a@example.com' },
  { id: 'usr_003', name: 'Budi Santoso', role: 'Operator Kecamatan', email: 'budi.s@example.com' },
  { id: 'usr_004', name: 'Dewi Lestari', role: 'Pengguna Biasa', email: 'dewi.l@example.com' },
  { id: 'usr_005', name: 'Rahmat Hidayat', role: 'Petugas Lapangan', email: 'rahmat.h@example.com' },
  { id: 'usr_006', name: 'Ahmad Dahlan', role: 'Administrator', email: 'ahmad.d@example.com' },
  { id: 'usr_007', name: 'Putri Ayu', role: 'Petugas Desa', email: 'putri.a@example.com' },
];

interface ManageUsersScreenProps {
  navigation: any; 
}

const ManageUsersScreen = ({ navigation }: ManageUsersScreenProps) => {
  const { colors, dark: isDarkMode }: Theme = useTheme();
  const insets = useSafeAreaInsets(); // <<< PANGGIL HOOK DI SINI

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const primaryActionColor = colors.primary;
  const destructiveColor = isDarkMode ? '#F87171' : '#EF4444';
  const secondaryTextColor = isDarkMode ? colors.notification : '#6B7280';
  const iconDefaultColor = isDarkMode ? colors.text : '#4A5568';

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      setTimeout(() => {
        setUsers(DUMMY_USERS_DATA);
        setIsLoading(false);
      }, 500);
      return () => {};
    }, [])
  );

  const handleAddUser = () => {
    Alert.alert("Tambah Pengguna", "Navigasi ke halaman tambah pengguna.");
    // navigation.navigate('AddUserScreen');
  };

  const handleEditUser = (user: User) => {
    Alert.alert("Edit Pengguna", `Edit pengguna: ${user.name}`);
    // navigation.navigate('EditUserScreen', { userId: user.id });
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      "Hapus Pengguna",
      `Apakah Anda yakin ingin menghapus pengguna "${user.name}"?`,
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive", 
          onPress: () => {
            setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
            console.log(`Pengguna ${user.name} dihapus.`);
          } 
        },
      ]
    );
  };

  const viewUserDetails = (user: User) => {
    Alert.alert("Detail Pengguna", `Melihat detail untuk ${user.name}.\nRole: ${user.role}\nEmail: ${user.email}`);
    // navigation.navigate('UserDetailScreen', { userId: user.id });
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    headerContainer: {
      paddingHorizontal: 24,
      paddingTop: Platform.OS === 'ios' ? 20 : 28,
      paddingBottom: 20,
      backgroundColor: colors.background,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
    },
    listContentContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 80, 
      flexGrow: 1,
    },
    userItemCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.12 : 0.06,
      shadowRadius: 5,
      elevation: isDarkMode ? 2 : 3,
    },
    avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${primaryActionColor}2A`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    userInfoContainer: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginBottom: 2,
    },
    userRole: {
      fontSize: 13,
      fontFamily: 'Poppins-Regular',
      color: secondaryTextColor,
      marginBottom: 1,
    },
    userEmail: {
      fontSize: 12,
      fontFamily: 'Poppins-Light',
      color: colors.border,
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 10,
      // Menggunakan insets.bottom untuk memastikan FAB tidak tertutup navigasi sistem
      bottom: 10 + insets.bottom, 
      backgroundColor: primaryActionColor,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyStateTextTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: colors.text,
        marginTop: 16,
        textAlign: 'center'
    },
    emptyStateTextMessage: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: colors.notification,
        textAlign: 'center',
        marginTop: 4,
    }
  });

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.userItemCard} onPress={() => viewUserDetails(item)} activeOpacity={0.8}>
      <View style={styles.avatarContainer}>
        <UserRound size={24} color={primaryActionColor} strokeWidth={2} />
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.userRole} numberOfLines={1}>{item.role}</Text>
        <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEditUser(item)}>
          <Edit3 size={20} color={iconDefaultColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteUser(item)}>
          <Trash2 size={20} color={destructiveColor} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Kelola Pengguna</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryActionColor} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Kelola Pengguna</Text>
        </View>

        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
                <Users size={64} color={colors.border} />
                <Text style={styles.emptyStateTextTitle}>Belum Ada Pengguna</Text>
                <Text style={styles.emptyStateTextMessage}>Anda dapat menambahkan pengguna baru melalui tombol di bawah.</Text>
            </View>
          }
        />
      </View>

      <TouchableOpacity style={styles.fab} onPress={handleAddUser} activeOpacity={0.8}>
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ManageUsersScreen;