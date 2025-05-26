import React, { useState, useEffect, useMemo } from 'react'; // useMemo dipertahankan jika diperlukan di masa mendatang
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
import { useTheme } from '@react-navigation/native'; // useFocusEffect tidak digunakan di versi ini
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

// DEFINISI KONSTANTA WARNA YANG MUNGKIN HILANG
const darkModeYellowAccent = '#FACC15'; // Warna aksen kuning untuk dark mode

// Struktur item yang bisa dicari
interface SearchableItem {
  id: string;
  type: 'pengguna' | 'desa' | 'kecamatan' | 'formulir';
  nama: string;
  deskripsiUtama?: string;
  deskripsiSekunder?: string;
}

// Dummy data source
const DUMMY_DATA_SOURCE: SearchableItem[] = [
  // Pengguna
  { id: 'pengguna-1', type: 'pengguna', nama: 'Azharangga Kusuma', deskripsiUtama: 'Administrator', deskripsiSekunder: 'azharanggakusuma01@gmail.com' },
  { id: 'pengguna-2', type: 'pengguna', nama: 'Siti Aminah', deskripsiUtama: 'Petugas Lapangan - Desa Klangenan', deskripsiSekunder: 'siti.a@example.com' },
  { id: 'pengguna-3', type: 'pengguna', nama: 'Budi Santoso', deskripsiUtama: 'Kepala Desa Maju Jaya', deskripsiSekunder: 'budi.s@example.com' },
  { id: 'pengguna-4', type: 'pengguna', nama: 'Dewi Lestari', deskripsiUtama: 'Staf Kecamatan Plumbon', deskripsiSekunder: 'dewi.l@example.com' },
  { id: 'pengguna-5', type: 'pengguna', nama: 'Rahmat Hidayat', deskripsiUtama: 'Operator Formulir', deskripsiSekunder: 'rahmat.h@example.com' },

  // Desa
  { id: 'desa-1', type: 'desa', nama: 'Desa Klangenan', deskripsiUtama: 'Kecamatan Plumbon', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-2', type: 'desa', nama: 'Desa Maju Jaya', deskripsiUtama: 'Kecamatan Weru', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-3', type: 'desa', nama: 'Desa Jamblang', deskripsiUtama: 'Kecamatan Jamblang', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-4', type: 'desa', nama: 'Desa Arjawinangun', deskripsiUtama: 'Kecamatan Arjawinangun', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-5', type: 'desa', nama: 'Desa Suranenggala', deskripsiUtama: 'Kecamatan Suranenggala', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-6', type: 'desa', nama: 'Desa Gegesik', deskripsiUtama: 'Kecamatan Gegesik', deskripsiSekunder: 'Kabupaten Indramayu' },
  { id: 'desa-7', type: 'desa', nama: 'Desa Cipeujeuh', deskripsiUtama: 'Kecamatan Lemahabang', deskripsiSekunder: 'Kabupaten Cirebon' },
  { id: 'desa-8', type: 'desa', nama: 'Desa Palimanan', deskripsiUtama: 'Kecamatan Palimanan', deskripsiSekunder: 'Kabupaten Cirebon' },

  // Kecamatan
  { id: 'kecamatan-1', type: 'kecamatan', nama: 'Kecamatan Plumbon', deskripsiUtama: 'Kabupaten Cirebon', deskripsiSekunder: '15 Desa/Kelurahan' },
  { id: 'kecamatan-2', type: 'kecamatan', nama: 'Kecamatan Weru', deskripsiUtama: 'Kabupaten Cirebon', deskripsiSekunder: '12 Desa/Kelurahan' },
  { id: 'kecamatan-3', type: 'kecamatan', nama: 'Kecamatan Jamblang', deskripsiUtama: 'Kabupaten Cirebon', deskripsiSekunder: '10 Desa/Kelurahan' },
  { id: 'kecamatan-4', type: 'kecamatan', nama: 'Kecamatan Arjawinangun', deskripsiUtama: 'Kabupaten Cirebon', deskripsiSekunder: '11 Desa/Kelurahan' },
  { id: 'kecamatan-5', type: 'kecamatan', nama: 'Kecamatan Lemahabang', deskripsiUtama: 'Kabupaten Cirebon', deskripsiSekunder: '13 Desa/Kelurahan' },
  { id: 'kecamatan-6', type: 'kecamatan', nama: 'Kecamatan Cirebon Utara', deskripsiUtama: 'Kota Cirebon', deskripsiSekunder: '4 Kelurahan' },

  // Formulir
  { id: 'form-1', type: 'formulir', nama: 'Formulir Pengajuan KTP', deskripsiUtama: 'Layanan Kependudukan', deskripsiSekunder: 'Kode: F-KTP.01' },
  { id: 'form-2', type: 'formulir', nama: 'Formulir Bantuan Sosial Desa', deskripsiUtama: 'Program Kesejahteraan', deskripsiSekunder: 'Kode: F-BANSOS.DS' },
  { id: 'form-3', type: 'formulir', nama: 'Formulir Laporan Kegiatan RT/RW', deskripsiUtama: 'Administrasi Desa', deskripsiSekunder: 'Kode: F-LAP.RTW' },
  { id: 'form-4', type: 'formulir', nama: 'Formulir Izin Mendirikan Bangunan (IMB) Desa', deskripsiUtama: 'Perizinan', deskripsiSekunder: 'Kode: F-IMB.DS' },
  { id: 'form-5', type: 'formulir', nama: 'Formulir Pendaftaran Usaha Mikro Kecil Menengah (UMKM)', deskripsiUtama: 'Ekonomi & Usaha', deskripsiSekunder: 'Kode: F-UMKM.REG' },
  { id: 'form-6', type: 'formulir', nama: 'Formulir Data Penduduk Miskin', deskripsiUtama: 'Data Sosial', deskripsiSekunder: 'Kode: F-DTKS.03' },
  { id: 'form-7', type: 'formulir', nama: 'Formulir Permohonan Surat Keterangan Usaha', deskripsiUtama: 'Layanan Administrasi', deskripsiSekunder: 'Kode: F-SKU.DS' },
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

const SearchScreenRedesigned = ({ navigation }: any) => {
  const { colors, dark: isDarkMode }: Theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const placeholderTextColor = isDarkMode ? '#71717A' : '#A1A1AA'; 
  const iconSearchColor = isDarkMode ? '#A1A1AA' : '#71717A'; 

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
        // navigation.navigate(detailScreen, params);
    } else {
        Alert.alert("Info", `Anda menekan item: ${item.nama} (Tipe: ${item.type})`);
    }
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    searchBarOuterContainer: {
        paddingTop: Platform.OS === 'ios' ? 10 : 16,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.background,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 48,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.1 : 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    searchIcon: { marginRight: 10 },
    textInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: colors.text,
      paddingVertical: 0,
    },
    clearButton: { padding: 6 },
    listContainer: {
        flex: 1,
    },
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
      color: colors.text,
      marginBottom: 3,
    },
    itemDeskripsiUtama: {
      fontSize: 13,
      fontFamily: 'Poppins-Regular',
      color: colors.text, 
      opacity: 0.8, 
      marginBottom: 2,
    },
    itemDeskripsiSekunder: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: colors.notification, 
    },
    itemChevron: {
        marginLeft: 10,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    emptyStateIcon: { marginBottom: 24 },
    emptyStateTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    emptyStateMessage: {
      fontSize: 15,
      fontFamily: 'Poppins-Regular',
      color: colors.notification,
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
    if (!hasSearched && searchQuery.trim() === '') {
      return (
        <View style={styles.emptyStateContainer}>
          <Search size={72} color={colors.border} style={styles.emptyStateIcon} />
          <Text style={styles.emptyStateTitle}>Pencarian Data</Text>
          <Text style={styles.emptyStateMessage}>Temukan formulir, data desa, kecamatan, atau informasi pengguna dengan cepat.</Text>
        </View>
      );
    }
    if (hasSearched && searchResults.length === 0 && searchQuery.trim() !== '') {
      return (
        <View style={styles.emptyStateContainer}>
          <Frown size={72} color={colors.border} style={styles.emptyStateIcon} />
          <Text style={styles.emptyStateTitle}>Oops! Tidak Ditemukan</Text>
          <Text style={styles.emptyStateMessage}>Kami tidak menemukan hasil untuk "{searchQuery}". Coba gunakan kata kunci lain.</Text>
        </View>
      );
    }
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
        <View style={styles.searchBarOuterContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={22} color={iconSearchColor} style={styles.searchIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Ketik untuk mencari..."
              placeholderTextColor={placeholderTextColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={Platform.OS !== 'web'}
              returnKeyType="search"
              onBlur={() => { /* Keyboard.dismiss(); Opsional */ }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                <X size={22} color={iconSearchColor} />
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

export default SearchScreenRedesigned;