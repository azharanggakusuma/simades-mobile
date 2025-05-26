import React, { useState, useEffect, useMemo } from 'react'; // Tambahkan useMemo
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import {
  Archive,
  ChevronRight,
  CheckCircle2,
  Edit3,
  ListFilter, // Icon untuk filter
} from 'lucide-react-native';

// --- Data Model dan Dummy Data (Sama seperti versi sebelum tab) ---
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
  // console.log('[createDummyDesaInputs] Generating dummy Desa input data...');
  const inputs: DesaInputRecord[] = [];
  const desas = ['Desa Klangenan', 'Desa Maju Jaya', 'Desa Plumbon', 'Desa Suranenggala', 'Desa Gempol'];
  let inputCounter = 1;
  const formsAlreadyInputted = [...MASTER_FORM_LIST]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(MASTER_FORM_LIST.length * Math.random() * 0.8 + MASTER_FORM_LIST.length * 0.1)); // Antara 10% - 90%

  formsAlreadyInputted.forEach(masterForm => {
    inputs.push({
      id: `input${inputCounter++}`,
      masterFormId: masterForm.id,
      inputBy: desas[inputCounter % desas.length],
      inputDate: new Date(Date.now() - inputCounter * (Math.random() * 10 + 5) * 24 * 60 * 60 * 1000),
      notes: Math.random() > 0.7 ? `Catatan penting untuk ${masterForm.name}` : undefined,
    });
  });
  // console.log(`[createDummyDesaInputs] Total Desa inputs generated: ${inputs.length}`);
  return inputs;
};

const formatTimestamp = (date?: Date): string => {
  if (!date) return '';
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

const FormWithFilterScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { colors, dark: isDarkMode } = theme;

  // State untuk menyimpan semua item yang sudah diproses
  const [allProcessedItems, setAllProcessedItems] = useState<UIDisplayItem[]>([]);
  // State untuk filter yang aktif
  const [currentFilter, setCurrentFilter] = useState<FilterType>('Semua');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
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
    
    // Urutkan semua item berdasarkan nama form secara default
    processedItems.sort((a, b) => a.formName.localeCompare(b.formName));
    setAllProcessedItems(processedItems);
    setIsLoading(false);
  }, []);

  // Gunakan useMemo untuk memfilter item yang akan ditampilkan berdasarkan currentFilter
  const displayedItems = useMemo(() => {
    if (isLoading) return []; // Jangan proses jika masih loading
    // console.log(`Filtering for: ${currentFilter}, total items: ${allProcessedItems.length}`);
    if (currentFilter === 'Belum Selesai') {
      return allProcessedItems.filter(item => item.uiStatus === 'Belum Selesai');
    }
    if (currentFilter === 'Selesai') {
      return allProcessedItems.filter(item => item.uiStatus === 'Selesai');
    }
    return allProcessedItems; // 'Semua'
  }, [allProcessedItems, currentFilter, isLoading]);

  const handleItemPress = (item: UIDisplayItem) => {
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

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    headerContainer: { paddingHorizontal: 20, paddingVertical: Platform.OS === 'ios' ? 12 : 16, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: isDarkMode ? colors.card : '#FFFFFF' },
    headerTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', color: colors.text, textAlign: 'center' },
    
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20, // Lebih bulat
        borderWidth: 1,
        borderColor: colors.border, // Default border
    },
    filterButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
    activeFilterButton: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    activeFilterButtonText: {
        color: '#FFFFFF', // Teks putih untuk tombol aktif
    },
    inactiveFilterButtonText: {
        color: colors.text,
    },

    listContentContainer: { paddingVertical: 8, paddingBottom: 16, flexGrow: 1 }, // flexGrow agar empty state di tengah

    itemContainer: { backgroundColor: colors.card, marginHorizontal: 16, marginVertical: 6, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: isDarkMode ? 0.12 : 0.06, shadowRadius: 3 },
    itemIconContainer: { marginRight: 16, width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
    itemTextContent: { flex: 1 },
    itemFormName: { fontSize: 15, fontFamily: 'Poppins-SemiBold', color: colors.text, marginBottom: 3 },
    itemDetailsText: { fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.notification, marginBottom: 2 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, alignSelf: 'flex-start', marginTop: 6 },
    statusText: { fontSize: 12, fontFamily: 'Poppins-Medium', marginLeft: 6 },
    itemNotes: { fontSize: 12, fontFamily: 'Poppins-Italic', color: colors.notification, marginTop: 4 },
    itemChevronContainer: { marginLeft: 10, justifyContent: 'center' },
    
    emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 20 },
    emptyStateIcon: { marginBottom: 16 },
    emptyStateTitle: { fontSize: 18, fontFamily: 'Poppins-SemiBold', color: colors.text, marginBottom: 8, textAlign: 'center' },
    emptyStateMessage: { fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.notification, textAlign: 'center' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background},
  });

  const renderListItem = ({ item }: { item: UIDisplayItem }) => {
    let MainIconComponent, mainIconColor, badgeBgColor, badgeTextColor, BadgeIconComponent;

    if (item.uiStatus === 'Selesai') {
        MainIconComponent = CheckCircle2;
        mainIconColor = isDarkMode ? '#A7F3D0' : '#059669';
        badgeBgColor = isDarkMode ? '#065F464D' : '#D1FAE5';
        badgeTextColor = mainIconColor;
        BadgeIconComponent = CheckCircle2;
    } else { // Belum Selesai
        MainIconComponent = Edit3;
        mainIconColor = colors.primary;
        badgeBgColor = isDarkMode ? '#4A5568' : '#E5E7EB';
        badgeTextColor = isDarkMode ? colors.card : colors.text;
        BadgeIconComponent = Edit3;
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.itemIconContainer, { backgroundColor: `${mainIconColor}20` }]}>
          <MainIconComponent size={20} color={mainIconColor} />
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
            <BadgeIconComponent size={15} color={badgeTextColor} />
            <Text style={[styles.statusText, { color: badgeTextColor }]}>{item.uiStatus}</Text>
          </View>
          {item.uiStatus === 'Selesai' && item.notes && (
            <Text style={styles.itemNotes}>Catatan: {item.notes}</Text>
          )}
        </View>
        <View style={styles.itemChevronContainer}>
            <ChevronRight size={20} color={colors.border} />
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
            <ListFilter size={48} color={colors.primary} />
            <Text style={{color: colors.text, fontSize: 18, marginTop: 10, fontFamily: 'Poppins-Regular'}}>Memuat formulir...</Text>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Status Input Formulir Desa</Text>
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
                <Archive size={64} color={colors.border} style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateTitle}>
                    {currentFilter === 'Semua' && displayedItems.length === 0 ? 'Tidak Ada Formulir' : `Tidak Ada Form ${currentFilter}`}
                </Text>
                <Text style={styles.emptyStateMessage}>
                    {currentFilter === 'Semua' && displayedItems.length === 0 ? 'Daftar formulir akan muncul di sini.' : `Tidak ada formulir yang cocok dengan filter "${currentFilter}".`}
                </Text>
            </View>
        }
      />
    </SafeAreaView>
  );
};

export default FormWithFilterScreen;