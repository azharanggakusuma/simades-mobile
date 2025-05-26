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
  ActivityIndicator,
  TextInput, // Import TextInput
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import {
  Archive,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Search, // Icon untuk input pencarian
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
  originalInputId?: string;
}

const createDummyDesaInputs = (): DesaInputRecord[] => {
  const inputs: DesaInputRecord[] = [];
  const desas = ['Desa Klangenan', 'Desa Maju Jaya', 'Desa Plumbon', 'Desa Suranenggala', 'Desa Gempol'];
  let inputCounter = 1;
  const formsAlreadyInputted = [...MASTER_FORM_LIST]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(MASTER_FORM_LIST.length * (Math.random() * 0.4 + 0.3))); 

  formsAlreadyInputted.forEach(masterForm => {
    inputs.push({
      id: `input${inputCounter++}`,
      masterFormId: masterForm.id,
      inputBy: desas[inputCounter % desas.length],
      inputDate: new Date(Date.now() - inputCounter * (Math.random() * 10 + 5) * 24 * 60 * 60 * 1000),
    });
  });
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

const grayColor = '#9A9A9A'; // Warna abu-abu yang diinginkan
const STATUS_SELESAI_COLOR = '#10B981';
const STATUS_BELUM_SELESAI_COLOR = '#EF4444';
const TEXT_ON_COLORED_BADGE = '#FFFFFF';

const HistoryScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { colors, dark: isDarkMode } = theme;

  const [allProcessedItems, setAllProcessedItems] = useState<UIDisplayItem[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
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
        displayItem = { masterFormId: masterForm.id, formName: masterForm.name, uiStatus: 'Selesai', inputBy: desaInput.inputBy, inputDate: desaInput.inputDate, originalInputId: desaInput.id };
      } else {
        displayItem = { masterFormId: masterForm.id, formName: masterForm.name, uiStatus: 'Belum Selesai' };
      }
      processedItems.push(displayItem);
    });
    
    processedItems.sort((a, b) => a.formName.localeCompare(b.formName));
    setAllProcessedItems(processedItems);
    setIsLoading(false);
  }, []);

  const displayedItems = useMemo(() => {
    if (isLoading) return [];
    
    let itemsFilteredByStatus = allProcessedItems;
    if (currentFilter === 'Belum Selesai') {
      itemsFilteredByStatus = allProcessedItems.filter(item => item.uiStatus === 'Belum Selesai');
    } else if (currentFilter === 'Selesai') {
      itemsFilteredByStatus = allProcessedItems.filter(item => item.uiStatus === 'Selesai');
    }

    if (searchQuery.trim() === '') {
      return itemsFilteredByStatus;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    return itemsFilteredByStatus.filter(item =>
      item.formName.toLowerCase().includes(lowercasedQuery)
    );
  }, [allProcessedItems, currentFilter, searchQuery, isLoading]);

  const handleItemPress = (item: UIDisplayItem) => {
    let message = `Formulir: ${item.formName}\nStatus: ${item.uiStatus}`;
    if (item.uiStatus === 'Selesai') {
      if (item.inputDate) message += `\nDiinput pada: ${formatTimestamp(item.inputDate)}`;
      if (item.inputBy) message += `\nOleh: ${item.inputBy}`;
    } else {
        message += '\n\nFormulir ini belum diisi oleh desa.';
    }
    Alert.alert("Detail Formulir", message);
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
        fontFamily: 'Poppins-SemiBold', 
        color: colors.text,
        textAlign: 'left',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginHorizontal: 20,
        marginTop: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchInput: {
        flex: 1,
        paddingVertical: Platform.OS === 'ios' ? 12 : 10,
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        color: colors.text,
        marginLeft: 8,
    },
    clearSearchButton: {
        padding: 4,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: colors.background,
        marginBottom: 8,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginRight: 12,
        borderWidth: 1,
    },
    filterButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        textAlign: 'center',
    },
    activeFilterButton: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    activeFilterButtonText: {
        color: isDarkMode && colors.primary === colors.background ? colors.text : (isDarkMode ? '#1F2937' : '#FFFFFF'),
        fontFamily: 'Poppins-SemiBold',
    },
    inactiveFilterButton: {
        backgroundColor: colors.card,
        borderColor: colors.border,
    },
    inactiveFilterButtonText: {
        color: colors.text,
    },
    listContentContainer: { 
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24, 
        flexGrow: 1 
    },
    itemContainer: { 
        backgroundColor: colors.card,
        borderRadius: 10,
        padding: 16,
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border, 
    },
    itemIconContainer: { 
        marginRight: 16, 
        width: 40, 
        height: 40, 
        borderRadius: 20,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    itemTextContent: { 
        flex: 1,
        justifyContent: 'center', 
    },
    itemFormName: { 
        fontSize: 16, 
        fontFamily: 'Poppins-SemiBold', 
        color: colors.text, 
        marginBottom: 3,
        lineHeight: 22,
    },
    itemDetailsText: { 
        fontSize: 13, 
        fontFamily: 'Poppins-Regular', 
        color: grayColor, // DIGANTI KE grayColor
        marginBottom: 2,
        lineHeight: 18,
    },
    statusBadge: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        alignSelf: 'flex-start', 
        marginTop: 8,
    },
    statusText: { 
        fontSize: 12, 
        fontFamily: 'Poppins-Medium',
        marginLeft: 6, 
    },
    itemChevronContainer: { marginLeft: 12, justifyContent: 'center' },
    emptyStateContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 24, 
        backgroundColor: colors.background,
    },
    emptyStateIcon: { marginBottom: 24 },
    emptyStateTitle: { 
        fontSize: 20, 
        fontFamily: 'Poppins-SemiBold', 
        color: colors.text, 
        marginBottom: 12, 
        textAlign: 'center' 
    },
    emptyStateMessage: { 
        fontSize: 15, 
        fontFamily: 'Poppins-Regular', 
        color: grayColor, // DIGANTI KE grayColor (jika colors.notification tidak diinginkan)
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

  const renderListItem = ({ item }: { item: UIDisplayItem }) => {
    let MainIconComponent, mainIconColor, badgeBgColor, badgeTextColor, BadgeIconComponent;

    if (item.uiStatus === 'Selesai') {
        MainIconComponent = CheckCircle2;
        mainIconColor = STATUS_SELESAI_COLOR;
        badgeBgColor = STATUS_SELESAI_COLOR;
        badgeTextColor = TEXT_ON_COLORED_BADGE;
        BadgeIconComponent = CheckCircle2;
    } else { 
        MainIconComponent = XCircle;
        mainIconColor = STATUS_BELUM_SELESAI_COLOR;
        badgeBgColor = STATUS_BELUM_SELESAI_COLOR;
        badgeTextColor = TEXT_ON_COLORED_BADGE;
        BadgeIconComponent = XCircle;
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer} 
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.itemIconContainer, { backgroundColor: `${mainIconColor}1A` }]}> 
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
            <BadgeIconComponent size={14} color={badgeTextColor} /> 
            <Text style={[styles.statusText, { color: badgeTextColor }]}>{item.uiStatus}</Text>
          </View>
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
            <Text style={{color: colors.text, fontSize: 16, marginTop: 16, fontFamily: 'Poppins-Regular'}}>Memuat formulir...</Text>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Status Formulir Desa</Text>
      </View>

      <View style={styles.searchInputContainer}>
        <Search size={20} color={grayColor} />
        <TextInput
            style={styles.searchInput}
            placeholder="Cari nama formulir..."
            placeholderTextColor={grayColor} // Placeholder juga menggunakan grayColor
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
        />
        {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
                <XCircle size={20} color={grayColor} />
            </TouchableOpacity>
        )}
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
                    {searchQuery ? 'Formulir Tidak Ditemukan' : (currentFilter === 'Semua' && displayedItems.length === 0 ? 'Belum Ada Formulir' : `Formulir ${currentFilter} Kosong`)}
                </Text>
                <Text style={styles.emptyStateMessage}>
                    {searchQuery ? `Tidak ada formulir yang cocok dengan pencarian "${searchQuery}".` : (currentFilter === 'Semua' && displayedItems.length === 0 ? 'Saat ini belum ada data formulir yang tersedia.' : `Tidak ada formulir yang berstatus "${currentFilter}" untuk ditampilkan.`)}
                </Text>
            </View>
        }
      />
    </SafeAreaView>
  );
};

export default HistoryScreen;