import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator, // Untuk loading indicator yang lebih modern
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import {
  Archive,
  ChevronRight,
  CheckCircle2,
  Edit3,
  // ListFilter, // Bisa diganti ActivityIndicator atau ikon lain untuk loading
} from 'lucide-react-native';

// --- Data Model dan Dummy Data (Tetap sama) ---
const MASTER_FORM_LIST = [
  { id: 'mf1', name: 'Keterangan Tempat' },
  { id: 'mf2', name: 'Keterangan Umum Desa Kelurahan' },
  { id: 'mf3', name: 'Kependudukan dan Ketenagakerjaan' },
  { id: 'mf4', name: 'Bencana Alam dan Mitigasi Bencana Alam' },
  { id: 'mf5', name: 'Pendidikan dan Kesehatan' },
  { id: 'mf6', name: 'Sosial Budaya' },
  { id: 'mf7', name: 'Olahraga' },
  { id: 'mf8', name: 'Angkutan, Komunikasi, dan Informasi' },
  { id: 'mf9', name: 'Ekonomi' },
  { id: 'mf10', name: 'Keamanan' },
  { id: 'mf11', name: 'Keuangan dan Aset Desa' },
  { id: 'mf12', name: 'Perlindungan Sosial, Pembangunan, dan Pemberdayaan Masyarakat' },
  { id: 'mf13', name: 'Aparatur Pemerintahan Desa' },
  { id: 'mf14', name: 'Lembaga Kemasyarakatan di Desa Kelurahan' },
  { id: 'mf15', name: 'Data Lokasi Geospasial' },
];

interface DesaInputRecord {
  id: string;
  masterFormId: string;
  inputBy: string;
  inputDate: Date;
  notes?: string;
}

interface UIDisplayItem {
  masterFormId: string;
  formName: string;
  uiStatus: 'Selesai' | 'Belum Selesai';
  inputBy?: string;
  inputDate?: Date;
  notes?: string;
  originalInputId?: string;
}

const createDummyDesaInputs = (): DesaInputRecord[] => {
  const inputs: DesaInputRecord[] = [];
  const desas = ['Desa Klangenan', 'Desa Maju Jaya', 'Desa Plumbon', 'Desa Suranenggala', 'Desa Gempol'];
  let inputCounter = 1;
  const formsAlreadyInputted = [...MASTER_FORM_LIST]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(MASTER_FORM_LIST.length * Math.random() * 0.8 + MASTER_FORM_LIST.length * 0.1));

  formsAlreadyInputted.forEach(masterForm => {
    inputs.push({
      id: `input${inputCounter++}`,
      masterFormId: masterForm.id,
      inputBy: desas[inputCounter % desas.length],
      inputDate: new Date(Date.now() - inputCounter * (Math.random() * 10 + 5) * 24 * 60 * 60 * 1000),
      notes: Math.random() > 0.7 ? `Catatan penting untuk ${masterForm.name}` : undefined,
    });
  });
  return inputs;
};

const formatTimestamp = (date?: Date): string => {
  if (!date) return '';
  // ... (fungsi formatTimestamp tetap sama)
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  if (seconds < 5) return `baru saja`;
  if (seconds < 60) return `${seconds} dtk lalu`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} mnt lalu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.round(hours / 24);
  if (days === 1) return `Kemarin, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  if (days < 7) return `${days} hr lalu`;
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};
// --- Akhir Data Model dan Dummy Data ---

type FilterType = 'Semua' | 'Belum Selesai' | 'Selesai';

const FormWithMinimalFilterScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { colors, dark: isDarkMode } = theme;

  const [allProcessedItems, setAllProcessedItems] = useState<UIDisplayItem[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('Semua');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulasi delay untuk menunjukkan loading state jika diperlukan
    // setTimeout(() => {
      const allDesaInputs = createDummyDesaInputs();
      const processedItems: UIDisplayItem[] = [];
      const latestInputMap = new Map<string, DesaInputRecord>();

      allDesaInputs.sort((a,b) => b.inputDate.getTime() - a.inputDate.getTime());
      for (const input of allDesaInputs) {
          if(!latestInputMap.has(input.masterFormId)) {
              latestInputMap.set(input.masterFormId, input);
          }
      }

      MASTER_FORM_LIST.forEach(masterForm => {
        const desaInput = latestInputMap.get(masterForm.id);
        let displayItem: UIDisplayItem;
        if (desaInput) {
          displayItem = { masterFormId: masterForm.id, formName: masterForm.name, uiStatus: 'Selesai', inputBy: desaInput.inputBy, inputDate: desaInput.inputDate, notes: desaInput.notes, originalInputId: desaInput.id };
        } else {
          displayItem = { masterFormId: masterForm.id, formName: masterForm.name, uiStatus: 'Belum Selesai' };
        }
        processedItems.push(displayItem);
      });
      
      processedItems.sort((a, b) => a.formName.localeCompare(b.formName));
      setAllProcessedItems(processedItems);
      setIsLoading(false);
    // }, 500); // Hapus atau sesuaikan delay ini
  }, []);

  const displayedItems = useMemo(() => {
    if (isLoading) return [];
    if (currentFilter === 'Belum Selesai') {
      return allProcessedItems.filter(item => item.uiStatus === 'Belum Selesai');
    }
    if (currentFilter === 'Selesai') {
      return allProcessedItems.filter(item => item.uiStatus === 'Selesai');
    }
    return allProcessedItems;
  }, [allProcessedItems, currentFilter, isLoading]);

  const handleItemPress = (item: UIDisplayItem) => {
    // ... (fungsi handleItemPress tetap sama)
    let message = `Formulir: ${item.formName}\nStatus: ${item.uiStatus}`;
    if (item.uiStatus === 'Selesai') {
      if (item.inputDate) message += `\nDiinput pada: ${formatTimestamp(item.inputDate)}`;
      if (item.inputBy) message += `\nOleh: ${item.inputBy}`;
      if (item.notes) message += `\nCatatan: ${item.notes}`;
    } else {
        message += '\n\nFormulir ini belum diisi oleh desa.';
    }
    Alert.alert("Detail Formulir", message);
  };

  // --- STYLES BARU dengan pendekatan minimalis & modern ---
  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 }, // Tidak banyak berubah
    headerContainer: { 
        paddingHorizontal: 20, 
        paddingVertical: Platform.OS === 'ios' ? 16 : 20, // Lebih banyak padding vertikal
        // backgroundColor: colors.background, // Samakan dengan background utama untuk kesan seamless
        // borderBottomWidth: 1, // Bisa dihilangkan jika filter jelas
        // borderBottomColor: colors.border,
    },
    headerTitle: { 
        fontSize: 24, // Sedikit lebih besar
        fontFamily: 'Poppins-SemiBold', // Mungkin SemiBold cukup
        color: colors.text, 
        textAlign: 'center' 
    },
    
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Tombol filter di tengah
        alignItems: 'center',
        paddingVertical: 16, // Padding atas bawah
        paddingHorizontal: 16,
        backgroundColor: colors.background, // Menyatu dengan background
        marginBottom: 8, // Jarak ke list
    },
    filterButton: {
        paddingVertical: 10,
        paddingHorizontal: 18, // Lebih lebar sedikit
        borderRadius: 8, // Sudut lebih tegas, tidak terlalu bulat
        marginHorizontal: 6, // Jarak antar tombol
        backgroundColor: colors.card, // Warna dasar tombol (inactive)
        borderWidth: 1,
        borderColor: colors.border, // Border halus untuk inactive
    },
    filterButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        textAlign: 'center',
    },
    activeFilterButton: {
        backgroundColor: colors.primary, // Warna primer untuk tombol aktif
        borderColor: colors.primary,
        elevation: 2, // Shadow halus untuk active button
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: {width: 0, height: 2}
    },
    activeFilterButtonText: {
        color: isDarkMode ? '#000000' : '#FFFFFF', // Teks kontras untuk tombol aktif
        fontFamily: 'Poppins-SemiBold',
    },
    inactiveFilterButtonText: {
        color: colors.text, // Warna teks untuk tombol tidak aktif
    },

    listContentContainer: { 
        paddingHorizontal: 8, // Kurangi padding horizontal agar kartu bisa lebih lebar
        paddingBottom: 16, 
        flexGrow: 1 
    },

    itemContainer: { 
        backgroundColor: colors.card, 
        marginHorizontal: 8, // Margin kartu terhadap list container
        marginVertical: 8, // Jarak vertikal antar kartu
        borderRadius: 12, // Rounded corner modern
        padding: 16, // Padding internal kartu
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 0, // Hilangkan border jika shadow cukup
        // Shadow yang lebih halus
        elevation: isDarkMode ? 1 : 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: isDarkMode ? 1 : 2 },
        shadowOpacity: isDarkMode ? 0.08 : 0.1,
        shadowRadius: isDarkMode ? 2 : 3.84,
    },
    itemIconContainer: { 
        marginRight: 16, 
        width: 44, // Sedikit lebih besar
        height: 44, 
        borderRadius: 22, // Sempurna bulat
        justifyContent: 'center', 
        alignItems: 'center',
        // backgroundColor sudah di renderListItem
    },
    itemTextContent: { flex: 1 },
    itemFormName: { 
        fontSize: 16, // Lebih menonjol
        fontFamily: 'Poppins-SemiBold', 
        color: colors.text, 
        marginBottom: 4 
    },
    itemDetailsText: { 
        fontSize: 13, // Sedikit lebih besar
        fontFamily: 'Poppins-Regular', 
        color: colors.notification, 
        marginBottom: 3,
        lineHeight: 18, // Jarak antar baris
    },
    statusBadge: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 10, 
        paddingVertical: 6, // Sedikit lebih tinggi
        borderRadius: 16, // Pill shape
        alignSelf: 'flex-start', 
        marginTop: 8 // Jarak ke atas
    },
    statusText: { 
        fontSize: 12, 
        fontFamily: 'Poppins-Medium', 
        marginLeft: 6 
    },
    itemNotes: { 
        fontSize: 13, 
        fontFamily: 'Poppins-Italic', 
        color: colors.notification, 
        marginTop: 6,
        lineHeight: 18,
    },
    itemChevronContainer: { marginLeft: 12 }, // Jarak chevron
    
    emptyStateContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20, 
        // marginTop: '20%', // Atau gunakan flex untuk benar-benar di tengah
    },
    emptyStateIcon: { marginBottom: 20 },
    emptyStateTitle: { 
        fontSize: 20, // Lebih besar
        fontFamily: 'Poppins-SemiBold', 
        color: colors.text, 
        marginBottom: 10, 
        textAlign: 'center' 
    },
    emptyStateMessage: { 
        fontSize: 15, // Lebih besar
        fontFamily: 'Poppins-Regular', 
        color: colors.notification, 
        textAlign: 'center',
        lineHeight: 22,
    },
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: colors.background
    },
  });
  // --- AKHIR STYLES BARU ---

  const renderListItem = ({ item }: { item: UIDisplayItem }) => {
    let MainIconComponent, mainIconColor, badgeBgColor, badgeTextColor, BadgeIconComponent;

    if (item.uiStatus === 'Selesai') {
        MainIconComponent = CheckCircle2;
        mainIconColor = isDarkMode ? '#6EE7B7' : '#10B981'; // Warna hijau yang lebih modern
        badgeBgColor = isDarkMode ? '#047857' : '#D1FAE5'; // Sesuaikan dengan mainIconColor
        badgeTextColor = isDarkMode ? '#A7F3D0' : '#065F46';
        BadgeIconComponent = CheckCircle2;
    } else { // Belum Selesai
        MainIconComponent = Edit3;
        mainIconColor = colors.primary; // Gunakan warna primer tema
        badgeBgColor = isDarkMode ? colors.border : '#E5E7EB'; // Abu-abu yang lebih soft
        badgeTextColor = colors.text; // Teks lebih kontras
        BadgeIconComponent = Edit3;
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.8} // Opacity lebih halus saat ditekan
      >
        <View style={[styles.itemIconContainer, { backgroundColor: `${mainIconColor}25` }]}> 
        {/* Opacity tint background sedikit lebih tinggi */}
          <MainIconComponent size={22} color={mainIconColor} />
        </View>
        <View style={styles.itemTextContent}>
          <Text style={styles.itemFormName} numberOfLines={2}>{item.formName}</Text>
          {item.uiStatus === 'Selesai' && item.inputDate && (
            <Text style={styles.itemDetailsText}>Diinput: {formatTimestamp(item.inputDate)}</Text>
          )}
          {item.uiStatus === 'Selesai' && item.inputBy && (
             <Text style={styles.itemDetailsText}>Oleh: {item.inputBy}</Text>
          )}
          <View style={[styles.statusBadge, { backgroundColor: badgeBgColor }]}>
            <BadgeIconComponent size={14} color={badgeTextColor} />
            <Text style={[styles.statusText, { color: badgeTextColor }]}>{item.uiStatus}</Text>
          </View>
          {item.uiStatus === 'Selesai' && item.notes && (
            <Text style={styles.itemNotes}>Catatan: {item.notes}</Text>
          )}
        </View>
        <View style={styles.itemChevronContainer}>
            <ChevronRight size={22} color={colors.border} />
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderFilterButton = (filterValue: FilterType, filterText: string) => (
    <TouchableOpacity
        style={[
            styles.filterButton,
            currentFilter === filterValue && styles.activeFilterButton,
        ]}
        onPress={() => setCurrentFilter(filterValue)}
        activeOpacity={0.7}
    >
        <Text style={[
            styles.filterButtonText,
            currentFilter === filterValue ? styles.activeFilterButtonText : styles.inactiveFilterButtonText,
        ]}>
            {filterText}
        </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
        <SafeAreaView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{color: colors.text, fontSize: 16, marginTop: 16, fontFamily: 'Poppins-Regular'}}>Memuat data formulir...</Text>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Status Formulir Desa</Text>
      </View>
      
      <View style={styles.filterContainer}>
        {renderFilterButton('Semua', 'Semua')}
        {renderFilterButton('Belum Selesai', 'Belum Selesai')}
        {renderFilterButton('Selesai', 'Selesai')}
      </View>

      <FlatList
        data={displayedItems}
        renderItem={renderListItem}
        keyExtractor={(item) => item.masterFormId}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
                <Archive size={72} color={colors.border} style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateTitle}>
                    {currentFilter === 'Semua' && displayedItems.length === 0 ? 'Tidak Ada Formulir' : `Tidak Ada Formulir ${currentFilter}`}
                </Text>
                <Text style={styles.emptyStateMessage}>
                    {currentFilter === 'Semua' && displayedItems.length === 0 ? 'Daftar formulir akan muncul di sini setelah ditambahkan.' : `Saat ini tidak ada formulir yang cocok dengan filter "${currentFilter}".`}
                </Text>
            </View>
        }
      />
    </SafeAreaView>
  );
};

export default FormWithMinimalFilterScreen;