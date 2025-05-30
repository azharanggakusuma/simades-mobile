import React, { useState, useEffect, useMemo } from 'react';
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
import { useTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import {
  Search,
  X,
  FileText,
  Users,
  Home,
  Building,
  Frown,
  Archive,
  ChevronRight,
} from 'lucide-react-native';

const darkModeYellowAccent = '#FACC15'; 

// Warna yang akan sering digunakan
const grayColor = '#9A9A9A'; // Abu-abu untuk placeholder, ikon search, teks sekunder
const searchResultNotFoundErrorColor = '#EF4444'; // Merah untuk pesan "tidak ditemukan"

interface SearchableItem {
  id: string;
  type: 'pengguna' | 'desa' | 'kecamatan' | 'formulir';
  nama: string;
  deskripsiUtama?: string;
  deskripsiSekunder?: string;
}

const DUMMY_DATA_SOURCE: SearchableItem[] = [
  // Pengguna (contoh tetap ada)
  { id: 'pengguna-1', type: 'pengguna', nama: 'Azharangga Kusuma', deskripsiUtama: 'Administrator Sistem', deskripsiSekunder: 'azharanggakusuma01@gmail.com' },
  { id: 'pengguna-2', type: 'pengguna', nama: 'Siti Aminah', deskripsiUtama: 'Petugas Lapangan - Desa Klangenan', deskripsiSekunder: 'siti.a@example.com' },
  { id: 'pengguna-3', type: 'pengguna', nama: 'Budi Santoso', deskripsiUtama: 'Kepala Desa Maju Jaya', deskripsiSekunder: 'budi.s@example.com' },
  { id: 'pengguna-4', type: 'pengguna', nama: 'Dewi Lestari', deskripsiUtama: 'Staf Kecamatan Plumbon', deskripsiSekunder: 'dewi.l@example.com' },
  { id: 'pengguna-5', type: 'pengguna', nama: 'Rahmat Hidayat', deskripsiUtama: 'Operator Formulir Desa Makmur', deskripsiSekunder: 'rahmat.h@example.com' },


  // Desa (contoh tetap ada)
  { id: 'desa-1', type: 'desa', nama: 'Desa Klangenan', deskripsiUtama: 'Kecamatan Plumbon', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-2', type: 'desa', nama: 'Desa Maju Jaya', deskripsiUtama: 'Kecamatan Weru', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-3', type: 'desa', nama: 'Desa Jamblang', deskripsiUtama: 'Kecamatan Jamblang', deskripsiSekunder: 'Kabupaten Cirebon' },
  // ... (tambahkan lebih banyak desa jika ada dari contoh sebelumnya)


  // Kecamatan (contoh tetap ada)
  { id: 'kecamatan-1', type: 'kecamatan', nama: 'Kecamatan Plumbon', deskripsiUtama: 'Kabupaten Cirebon', deskripsiSekunder: '15 Desa/Kelurahan' },
  { id: 'kecamatan-2', type: 'kecamatan', nama: 'Kecamatan Weru', deskripsiUtama: 'Kabupaten Cirebon', deskripsiSekunder: '12 Desa/Kelurahan' },
  // ... (tambahkan lebih banyak kecamatan jika ada dari contoh sebelumnya)


  // Formulir (LENGKAP DENGAN 15 FORMULIR)
  { id: 'form-1', type: 'formulir', nama: 'Keterangan Tempat', deskripsiUtama: 'Administrasi & Wilayah', deskripsiSekunder: 'Kode: F-ADM-001' },
  { id: 'form-2', type: 'formulir', nama: 'Keterangan Umum Desa Kelurahan', deskripsiUtama: 'Profil Desa/Kelurahan', deskripsiSekunder: 'Kode: F-PROFIL-002' },
  { id: 'form-3', type: 'formulir', nama: 'Kependudukan dan Ketenagakerjaan', deskripsiUtama: 'Data Penduduk', deskripsiSekunder: 'Kode: F-DUKCAPIL-003' },
  { id: 'form-4', type: 'formulir', nama: 'Bencana Alam dan Mitigasi Bencana Alam', deskripsiUtama: 'Penanggulangan Bencana', deskripsiSekunder: 'Kode: F-BENCANA-004' },
  { id: 'form-5', type: 'formulir', nama: 'Pendidikan dan Kesehatan', deskripsiUtama: 'Layanan Dasar', deskripsiSekunder: 'Kode: F-DIKES-005' },
  { id: 'form-6', type: 'formulir', nama: 'Sosial Budaya', deskripsiUtama: 'Kemasyarakatan', deskripsiSekunder: 'Kode: F-SOSBUD-006' },
  { id: 'form-7', type: 'formulir', nama: 'Olahraga', deskripsiUtama: 'Fasilitas & Kegiatan', deskripsiSekunder: 'Kode: F-OLAHRAGA-007' },
  { id: 'form-8', type: 'formulir', nama: 'Angkutan, Komunikasi, dan Informasi', deskripsiUtama: 'Infrastruktur & Layanan', deskripsiSekunder: 'Kode: F-KOMINFO-008' },
  { id: 'form-9', type: 'formulir', nama: 'Ekonomi', deskripsiUtama: 'Data Perekonomian', deskripsiSekunder: 'Kode: F-EKONOMI-009' },
  { id: 'form-10', type: 'formulir', nama: 'Keamanan', deskripsiUtama: 'Ketertiban Umum', deskripsiSekunder: 'Kode: F-KAMलिंग-010' }, // keamanan dan ketertiban lingkungan
  { id: 'form-11', type: 'formulir', nama: 'Keuangan dan Aset Desa', deskripsiUtama: 'Administrasi Keuangan', deskripsiSekunder: 'Kode: F-KEUAS-011' },
  { id: 'form-12', type: 'formulir', nama: 'Perlindungan Sosial, Pembangunan, dan Pemberdayaan Masyarakat', deskripsiUtama: 'Program Desa', deskripsiSekunder: 'Kode: F-PSPM-012' },
  { id: 'form-13', type: 'formulir', nama: 'Aparatur Pemerintahan Desa', deskripsiUtama: 'Data Aparatur', deskripsiSekunder: 'Kode: F-APARAT-013' },
  { id: 'form-14', type: 'formulir', nama: 'Lembaga Kemasyarakatan di Desa Kelurahan', deskripsiUtama: 'Organisasi Masyarakat', deskripsiSekunder: 'Kode: F-LEMMAS-014' },
  { id: 'form-15', type: 'formulir', nama: 'Data Lokasi Geospasial', deskripsiUtama: 'Pemetaan & Spasial', deskripsiSekunder: 'Kode: F-GEO-015' },
];

const getItemIcon = (type: SearchableItem['type'], color: string, size: number = 22) => {
  switch (type) {
    case 'pengguna': return <Users size={size} color={color} strokeWidth={1.8}/>;
    case 'desa': return <Home size={size} color={color} strokeWidth={1.8}/>;
    case 'kecamatan': return <Building size={size} color={color} strokeWidth={1.8}/>;
    case 'formulir': return <FileText size={size} color={color} strokeWidth={1.8}/>;
    default: return <FileText size={size} color={color} strokeWidth={1.8}/>;
  }
};

const SearchScreen = ({ navigation }: any) => {
  const { colors, dark: isDarkMode }: Theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const accentLight = colors.primary; 
  const accentDark = darkModeYellowAccent; 
  const currentAccentColor = isDarkMode ? accentDark : accentLight;

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      if(hasSearched) setHasSearched(false);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    if(!hasSearched) setHasSearched(true);
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();
      const filteredResults = DUMMY_DATA_SOURCE.filter(item =>
        item.nama.toLowerCase().includes(query) ||
        (item.deskripsiUtama && item.deskripsiUtama.toLowerCase().includes(query)) ||
        (item.deskripsiSekunder && item.deskripsiSekunder.toLowerCase().includes(query))
      );
      setSearchResults(filteredResults);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, hasSearched]);

  const handleClearSearch = () => setSearchQuery('');
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
        // navigation.navigate(detailScreen, params);
    } else {
        Alert.alert("Info", `Anda menekan item: ${item.nama} (Tipe: ${item.type})`);
    }
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    screenHeaderContainer: { 
        paddingHorizontal: 24, 
        paddingTop: Platform.OS === 'ios' ? 20 : 28,
        paddingBottom: 12, 
        backgroundColor: colors.background,
    },
    screenHeaderTitle: { 
        fontSize: 24, 
        fontFamily: 'Poppins-Bold', 
        color: colors.text,
        textAlign: 'left',
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
    listContainer: { flex: 1 },
    listContentContainer: {
      paddingTop: 8,
      paddingHorizontal: 16,
      paddingBottom: 32,
      flexGrow: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 30,
    },
    loadingText: {
        fontFamily: 'Poppins-Medium',
        marginTop: 12,
        fontSize: 15,
        color: colors.text
    },
    resultItem: { 
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.12 : 0.07,
      shadowRadius: 5,
      elevation: isDarkMode ? 3 : 4,
    },
    itemIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: `${currentAccentColor}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    itemTextContainer: { flex: 1 },
    itemNama: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text, // Teks utama, bukan merah
      marginBottom: 3,
    },
    itemDeskripsiUtama: {
      fontSize: 13,
      fontFamily: 'Poppins-Regular',
      color: grayColor, // Menggunakan grayColor
      opacity: 0.9, // Opacity bisa disesuaikan jika grayColor terlalu gelap/terang
      marginBottom: 2,
    },
    itemDeskripsiSekunder: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: grayColor, // Menggunakan grayColor
      opacity: 0.7,
    },
    itemChevron: { marginLeft: 10 },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    emptyStateIcon: { marginBottom: 24 },
    emptyStateTitle: { // Style default untuk judul empty state
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text, // Warna teks standar
      marginBottom: 10,
      textAlign: 'center',
    },
    notFoundTitle: { // Style khusus untuk judul "Tidak Ditemukan"
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        color: searchResultNotFoundErrorColor, // Warna merah khusus
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyStateMessage: {
      fontSize: 15,
      fontFamily: 'Poppins-Regular',
      color: grayColor, // Menggunakan grayColor untuk pesan empty state
      textAlign: 'center',
      lineHeight: 22,
    },
  });

  const renderResultItem = ({ item }: { item: SearchableItem }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleResultPress(item)} activeOpacity={0.75}>
      <View style={styles.itemIconContainer}>
        {getItemIcon(item.type, currentAccentColor)}
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemNama} numberOfLines={1}>{item.nama}</Text>
        {item.deskripsiUtama && <Text style={styles.itemDeskripsiUtama} numberOfLines={1}>{item.deskripsiUtama}</Text>}
        {item.deskripsiSekunder && <Text style={styles.itemDeskripsiSekunder} numberOfLines={1}>{item.deskripsiSekunder}</Text>}
      </View>
      <ChevronRight size={20} color={colors.border} style={styles.itemChevron} />
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (isLoading && searchQuery.trim() !== '') {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentAccentColor} />
          <Text style={styles.loadingText}>Mencari hasil...</Text>
        </View>
      );
    }
    // Initial state (belum ada pencarian)
    if (!hasSearched && searchQuery.trim() === '') {
      return (
        <View style={styles.emptyStateContainer}>
          <Search size={72} color={colors.border} style={styles.emptyStateIcon} />
          <Text style={styles.emptyStateTitle}>Pencarian Data</Text> 
          <Text style={styles.emptyStateMessage}>Temukan formulir, data desa, kecamatan, atau informasi pengguna.</Text>
        </View>
      );
    }
    // State ketika pencarian dilakukan dan tidak ada hasil
    if (hasSearched && searchResults.length === 0 && searchQuery.trim() !== '') {
      return (
        <View style={styles.emptyStateContainer}>
          <Frown size={72} color={colors.border} style={styles.emptyStateIcon} />
          {/* Menggunakan style notFoundTitle yang berwarna merah */}
          <Text style={styles.notFoundTitle}>Oops! Hasil Tidak Ditemukan</Text> 
          <Text style={styles.emptyStateMessage}>Kami tidak dapat menemukan data untuk "{searchQuery}". Coba kata kunci lain.</Text>
        </View>
      );
    }
    // State ketika ada hasil pencarian
    if (searchResults.length > 0) {
      return (
        <FlatList
          data={searchResults}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.screenHeaderContainer}>
          <Text style={styles.screenHeaderTitle}>Pencarian Data</Text> 
        </View>

        <View style={styles.searchInputWrapper}>
            <View style={styles.searchInputContainer}>
                <Search size={20} color={grayColor} style={styles.searchIcon} />
                <TextInput
                style={styles.textInput}
                placeholder="Ketik untuk mencari..."
                placeholderTextColor={grayColor}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={Platform.OS !== 'web'}
                returnKeyType="search"
                onBlur={() => {}}
                />
                {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                    <X size={20} color={grayColor} />
                </TouchableOpacity>
                )}
            </View>
        </View>
        
        <View style={styles.listContainer}>
            {renderContent()}
        </View>

      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;