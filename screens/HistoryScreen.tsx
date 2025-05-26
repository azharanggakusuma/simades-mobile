import React, { useState, useEffect } from 'react';
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
  CheckCircle2, // Ikon untuk 'Selesai'
  Edit3,        // Ikon untuk 'Belum Selesai' (belum diisi)
} from 'lucide-react-native';

// Daftar Master Formulir (tetap sama)
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

// Interface untuk data inputan desa yang sudah ada
// Keberadaan record ini untuk sebuah masterFormId menandakan form tersebut "Selesai"
interface DesaInputRecord {
  id: string; // ID unik untuk record inputan ini
  masterFormId: string;
  // formName tidak perlu disimpan di sini karena bisa diambil dari MASTER_FORM_LIST
  inputBy: string; // Nama Desa atau akun yang menginput
  inputDate: Date;
  notes?: string; // Catatan opsional saat input
}

// Interface untuk item yang akan ditampilkan di UI (lebih sederhana sekarang)
interface UIDisplayItem {
  masterFormId: string;
  formName: string;
  uiStatus: 'Selesai' | 'Belum Selesai';
  // Detail di bawah ini hanya ada jika uiStatus adalah 'Selesai'
  inputBy?: string;
  inputDate?: Date;
  notes?: string;
  originalInputId?: string; // ID dari DesaInputRecord
}

// Fungsi untuk membuat data dummy inputan desa
const createDummyDesaInputs = (): DesaInputRecord[] => {
  console.log('[createDummyDesaInputs] Generating dummy Desa input data...');
  const inputs: DesaInputRecord[] = [];
  const desas = ['Desa Klangenan', 'Desa Maju Jaya', 'Desa Plumbon'];
  
  let inputCounter = 1;
  // Ambil sebagian dari master list untuk disimulasikan sudah diinput
  const formsAlreadyInputted = [...MASTER_FORM_LIST]
    .sort(() => 0.5 - Math.random()) // Acak urutan
    .slice(0, Math.floor(MASTER_FORM_LIST.length * 0.6)); // Misal 60% form sudah diinput

  formsAlreadyInputted.forEach(masterForm => {
    inputs.push({
      id: `input${inputCounter++}`,
      masterFormId: masterForm.id,
      inputBy: desas[inputCounter % desas.length],
      inputDate: new Date(Date.now() - inputCounter * (Math.random() * 10 + 5) * 24 * 60 * 60 * 1000), // Beberapa hari/minggu lalu
      notes: Math.random() > 0.7 ? `Catatan untuk ${masterForm.name}` : undefined,
    });
  });

  console.log(`[createDummyDesaInputs] Total Desa inputs generated: ${inputs.length}`);
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

const VerySimpleFormStatusScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { colors, dark: isDarkMode } = theme;

  const [selesaiItems, setSelesaiItems] = useState<UIDisplayItem[]>([]);
  const [belumSelesaiItems, setBelumSelesaiItems] = useState<UIDisplayItem[]>([]);

  useEffect(() => {
    const allDesaInputs = createDummyDesaInputs();
    const processedSelesai: UIDisplayItem[] = [];
    const processedBelumSelesai: UIDisplayItem[] = [];

    // Buat Set dari masterFormId yang sudah diinput untuk pencarian cepat
    const inputtedMasterFormIds = new Set(allDesaInputs.map(input => input.masterFormId));
    // Jika ada beberapa input untuk masterFormId yang sama, ambil yang terbaru (opsional, tergantung logika bisnis)
    // Untuk sekarang, kita anggap satu input per masterFormId sudah cukup untuk dummy.
    // Jika perlu yang terbaru, buat map:
    const latestInputMap = new Map<string, DesaInputRecord>();
    allDesaInputs.sort((a,b) => b.inputDate.getTime() - a.inputDate.getTime()); // Terbaru dulu
    for (const input of allDesaInputs) {
        if(!latestInputMap.has(input.masterFormId)) {
            latestInputMap.set(input.masterFormId, input);
        }
    }


    MASTER_FORM_LIST.forEach(masterForm => {
      const desaInput = latestInputMap.get(masterForm.id); // Cek apakah ada input untuk form ini
      let displayItem: UIDisplayItem;

      if (desaInput) { // Jika ada record input, berarti "Selesai"
        displayItem = {
          masterFormId: masterForm.id,
          formName: masterForm.name,
          uiStatus: 'Selesai',
          inputBy: desaInput.inputBy,
          inputDate: desaInput.inputDate,
          notes: desaInput.notes,
          originalInputId: desaInput.id,
        };
        processedSelesai.push(displayItem);
      } else { // Jika tidak ada record input, berarti "Belum Selesai"
        displayItem = {
          masterFormId: masterForm.id,
          formName: masterForm.name,
          uiStatus: 'Belum Selesai',
        };
        processedBelumSelesai.push(displayItem);
      }
    });
    
    const sortByName = (a: UIDisplayItem, b: UIDisplayItem) => a.formName.localeCompare(b.formName);
    processedSelesai.sort(sortByName);
    processedBelumSelesai.sort(sortByName); // Cukup sort by name untuk "Belum Selesai"

    setSelesaiItems(processedSelesai);
    setBelumSelesaiItems(processedBelumSelesai);
    console.log(`Selesai: ${processedSelesai.length}, Belum Selesai: ${processedBelumSelesai.length}`);
  }, []);

  const handleItemPress = (item: UIDisplayItem) => {
    let message = `Formulir: ${item.formName}\nStatus: ${item.uiStatus}`;
    if (item.uiStatus === 'Selesai') {
      if (item.inputDate) {
        message += `\nDiinput pada: ${formatTimestamp(item.inputDate)}`;
      }
      if (item.inputBy) {
        message += `\nOleh: ${item.inputBy}`;
      }
      if (item.notes) {
        message += `\nCatatan: ${item.notes}`;
      }
    } else { // Belum Selesai
        message += '\n\nFormulir ini belum diisi oleh desa.';
    }
    Alert.alert("Detail Formulir", message);
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    headerContainer: { paddingHorizontal: 20, paddingVertical: Platform.OS === 'ios' ? 12 : 16, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: isDarkMode ? colors.card : '#FFFFFF' },
    headerTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', color: colors.text, textAlign: 'center' },
    sectionTitleContainer: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, backgroundColor: colors.background },
    sectionTitle: { fontSize: 18, fontFamily: 'Poppins-SemiBold', color: colors.text },
    listContentContainer: { paddingBottom: 16 },

    itemContainer: { backgroundColor: colors.card, marginHorizontal: 16, marginVertical: 6, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: isDarkMode ? 0.12 : 0.06, shadowRadius: 3 },
    itemIconContainer: { marginRight: 16, width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
    itemTextContent: { flex: 1 },
    itemFormName: { fontSize: 15, fontFamily: 'Poppins-SemiBold', color: colors.text, marginBottom: 3 },
    itemDetailsText: { fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.notification, marginBottom: 2 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, alignSelf: 'flex-start', marginTop: 6 },
    statusText: { fontSize: 12, fontFamily: 'Poppins-Medium', marginLeft: 6 },
    itemNotes: { fontSize: 12, fontFamily: 'Poppins-Italic', color: colors.notification, marginTop: 4 },
    itemChevronContainer: { marginLeft: 10, justifyContent: 'center' },
    
    emptyStateContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, minHeight: 150 },
    emptyStateIcon: { marginBottom: 16 },
    emptyStateTitle: { fontSize: 18, fontFamily: 'Poppins-SemiBold', color: colors.text, marginBottom: 8, textAlign: 'center' },
    emptyStateMessage: { fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.notification, textAlign: 'center' },
  });

  const renderListItem = ({ item }: { item: UIDisplayItem }) => {
    let MainIconComponent, mainIconColor, badgeBgColor, badgeTextColor, BadgeIconComponent;

    if (item.uiStatus === 'Selesai') {
        MainIconComponent = CheckCircle2;
        mainIconColor = isDarkMode ? '#A7F3D0' : '#059669'; // Hijau
        badgeBgColor = isDarkMode ? '#065F464D' : '#D1FAE5'; // Background hijau muda
        badgeTextColor = mainIconColor;
        BadgeIconComponent = CheckCircle2;
    } else { // uiStatus === 'Belum Selesai'
        MainIconComponent = Edit3;
        mainIconColor = colors.primary; // Warna primary untuk ikon "edit"
        badgeBgColor = isDarkMode ? '#4A5568' : '#E5E7EB'; // Abu-abu netral
        badgeTextColor = isDarkMode ? colors.card : colors.text; // Warna teks kontras dengan badge
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
  
  const ListHeader = ({ title } : {title: string}) => (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

   const flatListData = [
    { type: 'header', title: 'Belum Selesai Diinput Desa', id: 'header-belum-selesai' },
    ...(belumSelesaiItems.length > 0 
        ? belumSelesaiItems.map(item => ({ ...item, type: 'item' })) 
        : [{ type: 'empty', title: 'Tidak Ada Form Belum Diinput', message: 'Semua formulir telah diinput oleh desa atau belum ada data.', id: 'empty-belum-selesai'}]),
    { type: 'header', title: 'Sudah Selesai Diinput Desa', id: 'header-sudah-selesai' },
    ...(selesaiItems.length > 0 
        ? selesaiItems.map(item => ({ ...item, type: 'item' }))
        : [{ type: 'empty', title: 'Belum Ada Form Diinput', message: 'Belum ada formulir yang diinput oleh desa.', id: 'empty-sudah-selesai'}]),
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Status Input Formulir Desa</Text>
      </View>
      <FlatList
        data={flatListData}
        keyExtractor={(item, index) => item.id || `list-item-${index}`} // item.id di sini merujuk ke UIDisplayItem.masterFormId atau header/empty id
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <ListHeader title={item.title as string} />;
          }
          if (item.type === 'empty') {
            return (
              <View style={styles.emptyStateContainer}>
                <Archive size={48} color={colors.border} style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateTitle}>{item.title as string}</Text>
                <Text style={styles.emptyStateMessage}>{item.message as string}</Text>
              </View>
            );
          }
          return renderListItem({ item: item as UIDisplayItem });
        }}
        contentContainerStyle={styles.listContentContainer}
      />
    </SafeAreaView>
  );
};

export default VerySimpleFormStatusScreen;