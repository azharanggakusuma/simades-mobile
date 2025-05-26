import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  TextInput,
  Keyboard,
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Theme } from '@react-navigation/native';
import {
  UserRound,
  Edit3,
  Trash2,
  Plus,
  Users,
  Search,
  X,
  KeyRound, 
  AtSign,
} from 'lucide-react-native';

// --- Interface & Types ---
interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  password?: string;
  avatarUrl?: string;
}

// --- Dummy Data Pengguna dengan Username dan Password ---
// PERINGATAN: Menyimpan password plaintext di data (bahkan dummy) bukan praktik terbaik.
// Idealnya, backend hanya menyimpan hash password.
const DUMMY_USERS_DATA_WITH_USERNAME: User[] = [
  { id: 'usr_001', name: 'Azharangga Kusuma', username: 'azharangga_k', role: 'Administrator', password: 'password123' },
  { id: 'usr_002', name: 'Siti Aminah', username: 'siti_a', role: 'Petugas Desa', password: 'sitiPassword!' },
  { id: 'usr_003', name: 'Budi Santoso', username: 'budi_s', role: 'Operator Kecamatan', password: 'budiSecure' },
  { id: 'usr_004', name: 'Dewi Lestari', username: 'dewi_l', role: 'Pengguna Biasa', password: 'userPass4' },
  { id: 'usr_005', name: 'Rahmat Hidayat', username: 'rahmat_h', role: 'Petugas Lapangan', password: 'rahmatXYZ' },
  { id: 'usr_006', name: 'Ahmad Dahlan', username: 'ahmad_d', role: 'Administrator', password: 'adminAhmad' },
  { id: 'usr_007', name: 'Putri Ayu', username: 'putri_a', role: 'Petugas Desa', password: 'putriDesa' },
];

const grayColor = '#9A9A9A'; 

interface ManageUsersProps {
  navigation: any; 
}

const ManageUsers = ({ navigation }: ManageUsersProps) => {
  const { colors, dark: isDarkMode }: Theme = useTheme();
  const insets = useSafeAreaInsets();
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const primaryActionColor = colors.primary;
  const destructiveColor = isDarkMode ? '#F87171' : '#EF4444';
  const secondaryTextColor = isDarkMode ? colors.notification : '#6B7280';
  const iconDefaultColor = isDarkMode ? colors.text : '#4A5568';
  const passwordIconAndTextColor = secondaryTextColor; // Warna ikon dan teks password (abu-abu)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setTimeout(() => {
        let dataToProcess = DUMMY_USERS_DATA_WITH_USERNAME;
        if (debouncedSearchQuery.trim() !== '') {
          const lowercasedQuery = debouncedSearchQuery.toLowerCase().trim();
          dataToProcess = dataToProcess.filter(user =>
            user.name.toLowerCase().includes(lowercasedQuery) ||
            user.username.toLowerCase().includes(lowercasedQuery) ||
            user.role.toLowerCase().includes(lowercasedQuery)
          );
        }
        setAllUsers(dataToProcess);
        setIsLoading(false);
      }, 500);
    }, [debouncedSearchQuery])
  );

  const handleAddUser = () => {
    Alert.alert("Tambah Pengguna", "Navigasi ke halaman tambah pengguna.");
    // navigation.navigate('AddUserScreen');
  };

  const handleEditUser = (user: User) => {
    Alert.alert("Edit Pengguna", `Edit pengguna: ${user.name}`);
    // Di layar edit, Anda tidak akan menampilkan password lama,
    // tetapi menyediakan field untuk "Password Baru" dan "Konfirmasi Password Baru".
    // navigation.navigate('EditUserScreen', { userId: user.id });
  };

  const handleDeleteUser = (userToDelete: User) => {
    Alert.alert(
      "Hapus Pengguna",
      `Apakah Anda yakin ingin menghapus pengguna "${userToDelete.name}"?`,
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive", 
          onPress: () => {
            // Simulasi penghapusan dari data dummy utama
            const indexToRemove = DUMMY_USERS_DATA_WITH_USERNAME.findIndex(u => u.id === userToDelete.id);
            if (indexToRemove > -1) {
              DUMMY_USERS_DATA_WITH_USERNAME.splice(indexToRemove, 1);
            }
            // Update state lokal
            setAllUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
            console.log(`Pengguna ${userToDelete.name} dihapus.`);
          } 
        },
      ]
    );
  };
  
  const viewUserDetails = (user: User) => {
    // Tidak lagi menampilkan password di alert detail
    Alert.alert("Detail Pengguna", `Nama: ${user.name}\nUsername: ${user.username}\nRole: ${user.role}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    headerContainer: {
      paddingHorizontal: 24,
      paddingTop: Platform.OS === 'ios' ? 20 : 28,
      paddingBottom: 12,
      backgroundColor: colors.background,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
    },
    searchInputWrapper: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        paddingTop: 8,
        backgroundColor: colors.background,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 44,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchIcon: { marginRight: 8 },
    textInput: {
      flex: 1,
      fontSize: 15,
      fontFamily: 'Poppins-Regular',
      color: colors.text,
      paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    },
    clearButton: { padding: 4 },
    listContentContainer: {
      paddingHorizontal: 16,
      paddingTop: 0, 
      paddingBottom: 80 + insets.bottom, 
      flexGrow: 1,
    },
    userItemCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
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
    userInfoContainer: { flex: 1 },
    userName: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginBottom: 2,
    },
    userUsername: { // Style untuk username
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    userUsernameText: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: secondaryTextColor, 
        marginLeft: 4, // Jarak dari ikon AtSign
    },
    userRole: {
      fontSize: 13,
      fontFamily: 'Poppins-Regular',
      color: secondaryTextColor,
      marginBottom: 2,
    },
    userPasswordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 1,
    },
    userPasswordText: { 
      fontSize: 14, // Ukuran font bisa disesuaikan agar asterik terlihat jelas
      fontFamily: 'Poppins-Regular', // Bisa juga pakai Poppins-Light atau Medium
      color: passwordIconAndTextColor, // Warna abu-abu
      marginLeft: 4, 
      letterSpacing: 1.5, // Memberi jarak antar asterik
    },
    actionsContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    actionButton: { padding: 8, marginLeft: Platform.OS === 'ios' ? 10 : 8 },
    fab: {
      position: 'absolute', margin: 16, right: 10, bottom: 10 + insets.bottom, 
      backgroundColor: primaryActionColor, width: 56, height: 56, borderRadius: 28, 
      justifyContent: 'center', alignItems: 'center', elevation: 6,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84,
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyStateTextTitle: {
      fontSize: 18, fontFamily: 'Poppins-SemiBold', color: colors.text, 
      marginTop: 16, textAlign: 'center'
    },
    emptyStateTextMessage: {
      fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.notification, 
      textAlign: 'center', marginTop: 4, lineHeight: 20
    }
  });

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.userItemCard} onPress={() => viewUserDetails(item)} activeOpacity={0.8}>
      <View style={styles.avatarContainer}>
        <UserRound size={24} color={primaryActionColor} strokeWidth={2} />
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
        
        <View style={styles.userUsername}>
            <AtSign size={14} color={secondaryTextColor} />
            <Text style={styles.userUsernameText} numberOfLines={1}>{item.username}</Text>
        </View>

        <Text style={styles.userRole} numberOfLines={1}>{item.role}</Text>
        
        {/* Menampilkan Indikasi Password (Masked) */}
        {item.password && ( // Cek apakah password ada (meski tidak ditampilkan nilainya)
            <View style={styles.userPasswordContainer}>
                <KeyRound size={14} color={passwordIconAndTextColor} /> 
                <Text style={styles.userPasswordText} numberOfLines={1}>
                    ******** </Text>
            </View>
        )}
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

  if (isLoading && !allUsers.length) {
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

        <View style={styles.searchInputWrapper}>
            <View style={styles.searchInputContainer}>
                <Search size={20} color={grayColor} style={styles.searchIcon} />
                <TextInput
                style={styles.textInput}
                placeholder="Cari pengguna..."
                placeholderTextColor={grayColor}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={() => Keyboard.dismiss()}
                />
                {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                    <X size={20} color={grayColor} />
                </TouchableOpacity>
                )}
            </View>
        </View>

        <FlatList
          data={allUsers} 
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading && allUsers.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                  <Users size={64} color={colors.border} />
                  <Text style={styles.emptyStateTextTitle}>
                    {debouncedSearchQuery ? `Tidak Ada Hasil untuk "${debouncedSearchQuery}"` : "Belum Ada Pengguna"}
                  </Text>
                  <Text style={styles.emptyStateTextMessage}>
                    {debouncedSearchQuery ? "Coba kata kunci lain atau periksa kembali." : "Anda dapat menambahkan pengguna baru."}
                  </Text>
              </View>
            ) : null
          }
        />
      </View>

      <TouchableOpacity style={styles.fab} onPress={handleAddUser} activeOpacity={0.8}>
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ManageUsers;