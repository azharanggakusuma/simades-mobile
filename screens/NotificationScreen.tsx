import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  // ActivityIndicator, // Komentari untuk debugging ini
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import {
  FileText,
  Archive,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';

// Komentari impor hook dan komponen global untuk refresh SEMENTARA
// import useRefresh from '../hooks/useRefresh';
// import GlobalRefreshControl from '../components/GlobalRefreshControl';

interface FormSubmissionHistoryItem {
  id: string;
  formName: string;
  formCode?: string;
  submittedBy: string;
  submissionDate: Date;
  status: 'Diajukan' | 'Dalam Proses' | 'Disetujui' | 'Ditolak' | 'Selesai';
  notes?: string;
}

const createDummyFormSubmissions = (): FormSubmissionHistoryItem[] => {
  console.log('[createDummyFormSubmissions] Generating dummy data for direct display test...');
  const statuses: FormSubmissionHistoryItem['status'][] = ['Diajukan', 'Dalam Proses', 'Disetujui', 'Ditolak', 'Selesai'];
  const names = ['Laporan Dana Desa', 'Pengajuan BLT', 'Formulir Data Penduduk', 'Izin Usaha Mikro', 'Laporan Realisasi Anggaran', 'Formulir Keluhan', 'Survey Kepuasan Masyarakat'];
  const submitters = ['Desa Maju Jaya', 'Ahmad Subarjo (Anda)', 'Desa Klangenan', 'Siti Aminah (Anda)', 'Kecamatan Plumbon', 'Warga Anonim', 'Tim Survey Internal'];
  const items: FormSubmissionHistoryItem[] = [];
  for (let i = 1; i <= 15; i++) {
    items.push({
      id: `fs${i}`,
      formName: `${names[i % names.length]} #${i}`,
      formCode: `CODE-${String(1000 + i).padStart(4, '0')}`,
      submittedBy: submitters[i % submitters.length],
      submissionDate: new Date(Date.now() - i * (Math.random() * 5 + 1) * 24 * 60 * 60 * 1000),
      status: statuses[i % statuses.length],
      notes: statuses[i % statuses.length] === 'Ditolak' ? 'Dokumen tidak lengkap atau ada kesalahan input data.' : undefined,
    });
  }
  return items.sort((a, b) => b.submissionDate.getTime() - a.submissionDate.getTime());
};

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 5) return `baru saja`;
  if (seconds < 60) return `${seconds} dtk lalu`;
  if (minutes < 60) return `${minutes} mnt lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days === 1) return `Kemarin, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  if (days < 7) return `${days} hr lalu`;
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getStatusStyle = (status: FormSubmissionHistoryItem['status'], theme: Theme) => {
  const { colors, dark: isDarkMode } = theme;
  let IconComponent: React.ElementType = Clock;
  let iconColor = colors.text;
  let textColor = colors.text;
  let backgroundColor = colors.background;

  switch (status) {
    case 'Diajukan':
      textColor = isDarkMode ? '#FBBF24' : '#B45309';
      backgroundColor = isDarkMode ? '#78350F4D' : '#FEF3C7';
      IconComponent = Clock; iconColor = textColor;
      break;
    case 'Dalam Proses':
      textColor = isDarkMode ? '#93C5FD' : '#2563EB';
      backgroundColor = isDarkMode ? '#1E3A8A4D' : '#DBEAFE';
      IconComponent = Clock; iconColor = textColor;
      break;
    case 'Disetujui':
    case 'Selesai':
      textColor = isDarkMode ? '#A7F3D0' : '#059669';
      backgroundColor = isDarkMode ? '#065F464D' : '#D1FAE5';
      IconComponent = CheckCircle2; iconColor = textColor;
      break;
    case 'Ditolak':
      textColor = isDarkMode ? '#FCA5A5' : '#DC2626';
      backgroundColor = isDarkMode ? '#7F1D1D4D' : '#FEE2E2';
      IconComponent = XCircle; iconColor = textColor;
      break;
  }
  return { IconComponent, iconColor, textColor, backgroundColor };
};

const FormSubmissionHistoryScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { colors, dark: isDarkMode } = theme;

  // LANGSUNG ISI DATA, TANPA ASYNCHRONOUS LOADING UNTUK TES INI
  const [historyItems, setHistoryItems] = useState<FormSubmissionHistoryItem[]>(() => {
    console.log('Initializing state with dummy data...');
    return createDummyFormSubmissions();
  });

  // Logika isLoadingInitial dan useRefresh/fetchData dikomentari SEMENTARA
  // const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  // const fetchData = useCallback(async (isCalledByRefresh: boolean = false) => {
  //   // ...
  // }, []);
  // const { isRefreshing, onRefresh } = useRefresh(fetchData);
  // useEffect(() => {
  //   fetchData(false);
  // }, [fetchData]);


  const handleItemPress = (item: FormSubmissionHistoryItem) => {
    console.log('Riwayat pengisian form ditekan:', item.id);
    Alert.alert(
      item.formName,
      `Status: ${item.status}\nOleh: ${item.submittedBy}\nPada: ${formatTimestamp(item.submissionDate)}${item.notes ? `\nCatatan: ${item.notes}` : ''}`
    );
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    headerContainer: {
      paddingHorizontal: 20,
      paddingVertical: Platform.OS === 'ios' ? 12 : 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: isDarkMode ? colors.card : '#FFFFFF',
    },
    headerTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', color: colors.text, textAlign: 'center' },
    listContentContainer: { paddingVertical: 8, flexGrow: 1 },
    itemContainer: { // Style item yang sudah dirapikan
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.12 : 0.06,
      shadowRadius: 3,
    },
    itemIconContainer: {
      marginRight: 16,
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: `${colors.primary}1A`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemTextContent: { flex: 1 },
    itemFormName: { fontSize: 15, fontFamily: 'Poppins-SemiBold', color: colors.text, marginBottom: 3 },
    itemFormCode: { fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.notification, marginBottom: 6 },
    itemSubmittedBy: { fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.notification, marginBottom: 4 },
    itemDate: { fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.border, marginBottom: 10 },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
      alignSelf: 'flex-start',
    },
    statusText: { fontSize: 12, fontFamily: 'Poppins-Medium', marginLeft: 6 },
    itemNotes: { fontSize: 12, fontFamily: 'Poppins-Italic', color: colors.notification, marginTop: 6, paddingLeft: 4 },
    itemChevronContainer: { marginLeft: 10, justifyContent: 'center' },
    emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: colors.background, marginTop: -50 },
    emptyStateIcon: { marginBottom: 20 },
    emptyStateTitle: { fontSize: 20, fontFamily: 'Poppins-SemiBold', color: colors.text, marginBottom: 8, textAlign: 'center' },
    emptyStateMessage: { fontSize: 15, fontFamily: 'Poppins-Regular', color: colors.notification, textAlign: 'center' },
  });

  const renderItem = ({ item }: { item: FormSubmissionHistoryItem }) => {
    const { IconComponent, iconColor, textColor, backgroundColor } = getStatusStyle(item.status, theme);
    // console.log(`Rendering item: ${item.formName}, Status Icon: ${IconComponent ? 'Yes' : 'No'}`); // Untuk cek IconComponent
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.itemIconContainer}>
          <FileText size={20} color={colors.primary} />
        </View>
        <View style={styles.itemTextContent}>
          <Text style={styles.itemFormName} numberOfLines={1}>{item.formName}</Text>
          {item.formCode && <Text style={styles.itemFormCode}>{item.formCode}</Text>}
          <Text style={styles.itemSubmittedBy}>Oleh: {item.submittedBy}</Text>
          <Text style={styles.itemDate}>{formatTimestamp(item.submissionDate)}</Text>
          <View style={[styles.statusBadge, { backgroundColor }]}>
            {/* Pastikan IconComponent adalah komponen yang valid */}
            {IconComponent && <IconComponent size={15} color={textColor} />}
            <Text style={[styles.statusText, { color: textColor }]}>{item.status}</Text>
          </View>
          {item.notes && item.status === 'Ditolak' && (
            <Text style={styles.itemNotes}>Catatan: {item.notes}</Text>
          )}
        </View>
        <View style={styles.itemChevronContainer}>
            <ChevronRight size={20} color={colors.border} />
        </View>
      </TouchableOpacity>
    );
  };

  // Cek di konsol apakah historyItems memiliki data sebelum render FlatList
  console.log(`[Render] historyItems length for FlatList: ${historyItems.length}`);

  // Kondisi loading dihilangkan sementara
  // if (isLoadingInitial && !isRefreshing) { ... }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Riwayat Pengisian Formulir</Text>
        </View>
        <FlatList
          data={historyItems} // Data langsung dari state
          renderItem={renderItem} // Menggunakan renderItem yang sudah dirapikan
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={ // Akan tampil jika historyItems benar-benar kosong
              <View style={styles.emptyStateContainer}>
                <Archive size={64} color={colors.border} style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateTitle}>Belum Ada Riwayat</Text>
                <Text style={styles.emptyStateMessage}>Riwayat pengisian formulir Anda akan muncul di sini.</Text>
              </View>
          }
          // RefreshControl dikomentari sementara
          // refreshControl={
          //   <GlobalRefreshControl
          //     refreshing={isRefreshing}
          //     onRefresh={onRefresh}
          //   />
          // }
        />
      </View>
    </SafeAreaView>
  );
};

export default FormSubmissionHistoryScreen;