import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import {
  Search,
  X,
  FileText,     // Untuk Formulir
  Users,        // Untuk Pengguna
  Home,         // Untuk Desa
  Building,     // Untuk Kecamatan
  Frown,
  Archive,
  ChevronRight,
} from 'lucide-react-native';

// Struktur item yang bisa dicari (tanpa 'article')
interface SearchableItem {
  id: string;
  type: 'pengguna' | 'desa' | 'kecamatan' | 'formulir';
  nama: string;
  deskripsiUtama?: string;
  deskripsiSekunder?: string;
}

// Dummy data source yang diperbarui: tanpa artikel, lebih banyak desa, kecamatan, formulir
const DUMMY_DATA_SOURCE: SearchableItem[] = [
  // Pengguna (contoh tetap ada)
  { id: 'pengguna-1', type: 'pengguna', nama: 'Azharangga Kusuma', deskripsiUtama: 'Administrator', deskripsiSekunder: 'azharanggakusuma01@gmail.com' },
  { id: 'pengguna-2', type: 'pengguna', nama: 'Siti Aminah', deskripsiUtama: 'Petugas Lapangan - Desa Klangenan', deskripsiSekunder: 'siti.a@example.com' },
  { id: 'pengguna-3', type: 'pengguna', nama: 'Budi Santoso', deskripsiUtama: 'Kepala Desa Maju Jaya', deskripsiSekunder: 'budi.s@example.com' },
  { id: 'pengguna-4', type: 'pengguna', nama: 'Dewi Lestari', deskripsiUtama: 'Staf Kecamatan Plumbon', deskripsiSekunder: 'dewi.l@example.com' },
  { id: 'pengguna-5', type: 'pengguna', nama: 'Rahmat Hidayat', deskripsiUtama: 'Operator Formulir', deskripsiSekunder: 'rahmat.h@example.com' },


  // Desa (ditambah lebih banyak)
  { id: 'desa-1', type: 'desa', nama: 'Desa Klangenan', deskripsiUtama: 'Kecamatan Plumbon', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-2', type: 'desa', nama: 'Desa Maju Jaya', deskripsiUtama: 'Kecamatan Weru', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-3', type: 'desa', nama: 'Desa Jamblang', deskripsiUtama: 'Kecamatan Jamblang', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-4', type: 'desa', nama: 'Desa Arjawinangun', deskripsiUtama: 'Kecamatan Arjawinangun', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-5', type: 'desa', nama: 'Desa Suranenggala', deskripsiUtama: 'Kecamatan Suranenggala', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-6', type: 'desa', nama: 'Desa Gegesik', deskripsiUtama: 'Kecamatan Gegesik', deskripsiSekunder: 'Kabupaten Indramayu' },
  { id: 'desa-7', type: 'desa', nama: 'Desa Cipeujeuh', deskripsiUtama: 'Kecamatan Lemahabang', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-8', type: 'desa', nama: 'Desa Palimanan', deskripsiUtama: 'Kecamatan Palimanan', deskripsiSekunder: 'Kabupaten Cirebon' },


  // Kecamatan (ditambah lebih banyak)
  { id: 'kecamatan-1', type: 'kecamatan', nama: 'Kecamatan Plumbon', deskripsiUtama: 'Kabupaten Cirebon', deskripsiSekunder: '15 Desa/Kelurahan' },
  { id: 'kecamatan-2', type: 'kecamatan', nama: 'Kecamatan Weru', deskripsiUtama: 'Kabupaten Cirebon', deskripsiSekunder: '12 Desa/Kelurahan' },
  { id: 'kecamatan-3', type: 'kecamatan', nama: 'Kecamatan Jamblang', deskripsiUtama: 'Kabupaten Cirebon', deskripsiSekunder: '10 Desa/Kelurahan' },
  { id: 'kecamatan-4', type: 'kecamatan', nama: 'Kecamatan Arjawinangun', deskripsiUtama: 'Kabupaten Cirebon', deskripsiSekunder: '11 Desa/Kelurahan' },
  { id: 'kecamatan-5', type: 'kecamatan', nama: 'Kecamatan Lemahabang', deskripsiUtama: 'Kabupaten Cirebon', deskripsiSekunder: '13 Desa/Kelurahan' },
  { id: 'kecamatan-6', type: 'kecamatan', nama: 'Kecamatan Cirebon Utara', deskripsiUtama: 'Kota Cirebon', deskripsiSekunder: '4 Kelurahan' },


  // Formulir (ditambah lebih banyak)
  { id: 'form-1', type: 'formulir', nama: 'Formulir Pengajuan KTP', deskripsiUtama: 'Layanan Kependudukan', deskripsiSekunder: 'Kode: F-KTP.01' },
  { id: 'form-2', type: 'formulir', nama: 'Formulir Bantuan Sosial Desa', deskripsiUtama: 'Program Kesejahteraan', deskripsiSekunder: 'Kode: F-BANSOS.DS' },
  { id: 'form-3', type: 'formulir', nama: 'Formulir Laporan Kegiatan RT/RW', deskripsiUtama: 'Administrasi Desa', deskripsiSekunder: 'Kode: F-LAP.RTW' },
  { id: 'form-4', type: 'formulir', nama: 'Formulir Izin Mendirikan Bangunan (IMB) Desa', deskripsiUtama: 'Perizinan', deskripsiSekunder: 'Kode: F-IMB.DS' },
  { id: 'form-5', type: 'formulir', nama: 'Formulir Pendaftaran Usaha Mikro Kecil Menengah (UMKM)', deskripsiUtama: 'Ekonomi & Usaha', deskripsiSekunder: 'Kode: F-UMKM.REG' },
  { id: 'form-6', type: 'formulir', nama: 'Formulir Data Penduduk Miskin', deskripsiUtama: 'Data Sosial', deskripsiSekunder: 'Kode: F-DTKS.03' },
  { id: 'form-7', type: 'formulir', nama: 'Formulir Permohonan Surat Keterangan Usaha', deskripsiUtama: 'Layanan Administrasi', deskripsiSekunder: 'Kode: F-SKU.DS' },
];

// Helper untuk mendapatkan ikon berdasarkan tipe item baru
const getItemIcon = (type: SearchableItem['type'], color: string, size: number = 20) => {
  switch (type) {
    case 'pengguna': return <Users size={size} color={color} />;
    case 'desa': return <Home size={size} color={color} />;
    case 'kecamatan': return <Building size={size} color={color} />;
    case 'formulir': return <FileText size={size} color={color} />;
    default: return <FileText size={size} color={color} />;
  }
};

const SearchScreen = ({ navigation }: any) => {
  const { colors, dark: isDarkMode }: Theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const grayColor = '#9A9A9A';
  const accentLight = '#111827';
  const accentDark = '#FACC15';
  const currentAccentColor = isDarkMode ? accentDark : accentLight;

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const filteredResults = DUMMY_DATA_SOURCE.filter(item =>
        item.nama.toLowerCase().includes(query) ||
        (item.deskripsiUtama && item.deskripsiUtama.toLowerCase().includes(query)) ||
        (item.deskripsiSekunder && item.deskripsiSekunder.toLowerCase().includes(query))
      );
      setSearchResults(filteredResults);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleResultPress = (item: SearchableItem) => {
    console.log('Result pressed:', item);
    let detailScreen = '';
    let params = { itemId: item.id, itemName: item.nama };

    switch (item.type) {
      case 'pengguna': detailScreen = 'UserProfileScreen'; break;
      case 'desa': detailScreen = 'DesaDetailScreen'; break;
      case 'kecamatan': detailScreen = 'KecamatanDetailScreen'; break;
      case 'formulir': detailScreen = 'FormulirDetailScreen'; break;
    }
    if (detailScreen && navigation) {
        Alert.alert("Navigasi (Contoh)", `Akan navigasi ke ${detailScreen} untuk item ${item.nama}`);
        // navigation.navigate(detailScreen, params); // Uncomment untuk navigasi aktual
    } else {
        Alert.alert("Info", `Anda menekan item: ${item.nama} (Tipe: ${item.type})`);
    }
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    searchHeader: {
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'ios' ? 12 : 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 10,
      paddingHorizontal: 12,
      height: 44,
    },
    searchIcon: { marginRight: 10 },
    textInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: colors.text,
      paddingVertical: 0,
    },
    clearButton: { padding: 4 },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    loadingText: {
        fontFamily: 'Poppins-Regular',
        marginTop: 10,
        color: colors.text
    },
    listContentContainer: {
      paddingBottom: 20,
      flexGrow: 1,
    },
    resultItem: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      alignItems: 'center',
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itemIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${currentAccentColor}2A`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    itemTextContainer: { flex: 1 },
    itemNama: {
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
      color: colors.text,
      marginBottom: 2,
    },
    itemDeskripsiUtama: {
      fontSize: 13,
      fontFamily: 'Poppins-Regular',
      color: colors.notification,
      marginBottom: 1,
    },
    itemDeskripsiSekunder: {
      fontSize: 12,
      fontFamily: 'Poppins-Light',
      color: colors.border,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      marginTop: -( (Platform.OS === 'ios' ? 12 : 16) + 12 + 44) / 2,
    },
    emptyStateIcon: { marginBottom: 20 },
    emptyStateTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: currentAccentColor,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyStateMessage: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: colors.notification,
      textAlign: 'center',
    },
  });

  const renderResultItem = ({ item }: { item: SearchableItem }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleResultPress(item)} activeOpacity={0.7}>
      <View style={styles.itemIconContainer}>
        {getItemIcon(item.type, currentAccentColor)}
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemNama}>{item.nama}</Text>
        {item.deskripsiUtama && <Text style={styles.itemDeskripsiUtama}>{item.deskripsiUtama}</Text>}
        {item.deskripsiSekunder && <Text style={styles.itemDeskripsiSekunder}>{item.deskripsiSekunder}</Text>}
      </View>
      <ChevronRight size={20} color={colors.border} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchHeader}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={grayColor} style={styles.searchIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Cari data formulir, desa, kecamatan, pengguna..."
              placeholderTextColor={grayColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={Platform.OS !== 'web'}
              returnKeyType="search"
              onSubmitEditing={() => Keyboard.dismiss()}
              onBlur={() => Keyboard.dismiss()}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                <X size={20} color={grayColor} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isLoading && searchQuery.trim() !== '' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={currentAccentColor} />
            <Text style={styles.loadingText}>Mencari...</Text>
          </View>
        )}

        {!isLoading && !hasSearched && searchQuery.trim() === '' && (
           <View style={styles.emptyStateContainer}>
            <Search size={64} color={colors.border} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateTitle}>Pencarian Data</Text>
            <Text style={styles.emptyStateMessage}>Ketik untuk mencari formulir, desa, kecamatan, atau pengguna.</Text>
          </View>
        )}

        {!isLoading && hasSearched && searchResults.length === 0 && searchQuery.trim() !== '' && (
          <View style={styles.emptyStateContainer}>
            <Frown size={64} color={colors.border} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateTitle}>Data Tidak Ditemukan</Text>
            <Text style={styles.emptyStateMessage}>Tidak ada hasil untuk "{searchQuery}". Coba kata kunci yang berbeda.</Text>
          </View>
        )}

        {!isLoading && searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            renderItem={renderResultItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContentContainer}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;