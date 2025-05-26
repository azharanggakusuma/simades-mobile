import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import { FileText, ChevronRight, Archive } from 'lucide-react-native';

// Interface untuk setiap item formulir dalam daftar
interface FormListItem {
  id: string;
  name: string;
  category: string; 
}

// Daftar 15 Formulir
const ALL_FORMS_LIST: FormListItem[] = [
  { id: 'F001', name: 'Keterangan Tempat', category: 'Administrasi & Wilayah' },
  { id: 'F002', name: 'Keterangan Umum Desa Kelurahan', category: 'Profil Desa/Kelurahan' },
  { id: 'F003', name: 'Kependudukan dan Ketenagakerjaan', category: 'Data Penduduk' },
  { id: 'F004', name: 'Bencana Alam dan Mitigasi Bencana Alam', category: 'Penanggulangan Bencana' },
  { id: 'F005', name: 'Pendidikan dan Kesehatan', category: 'Layanan Dasar' },
  { id: 'F006', name: 'Sosial Budaya', category: 'Kemasyarakatan' },
  { id: 'F007', name: 'Olahraga', category: 'Fasilitas & Kegiatan' },
  { id: 'F008', name: 'Angkutan, Komunikasi, dan Informasi', category: 'Infrastruktur & Layanan' },
  { id: 'F009', name: 'Ekonomi', category: 'Data Perekonomian' },
  { id: 'F010', name: 'Keamanan', category: 'Ketertiban Umum' },
  { id: 'F011', name: 'Keuangan dan Aset Desa', category: 'Administrasi Keuangan' },
  { id: 'F012', name: 'Perlindungan Sosial, Pembangunan, dan Pemberdayaan Masyarakat', category: 'Program Desa' },
  { id: 'F013', name: 'Aparatur Pemerintahan Desa', category: 'Data Aparatur' },
  { id: 'F014', name: 'Lembaga Kemasyarakatan di Desa Kelurahan', category: 'Organisasi Masyarakat' },
  { id: 'F015', name: 'Data Lokasi Geospasial', category: 'Pemetaan & Spasial' },
];

interface FormScreenProps {
  navigation: any; 
}

const FormScreen = ({ navigation }: FormScreenProps) => {
  const { colors, dark: isDarkMode }: Theme = useTheme();

  // Warna untuk ikon dan teks sekunder
  // Untuk mode light, ikon akan menggunakan warna primer tema (diharapkan biru)
  // Untuk mode dark, ikon juga akan menggunakan warna primer tema (mungkin aksen kuning atau lainnya)
  const iconColor = colors.primary; 
  
  const secondaryTextColor = isDarkMode ? colors.notification : '#6B7280'; // Abu-abu untuk teks kategori
  const chevronListItemColor = isDarkMode ? colors.border : '#CBD5E0'; // Warna chevron


  const handleFormItemPress = (formItem: FormListItem) => {
    Alert.alert(
      `Formulir: ${formItem.name}`,
      `Anda memilih formulir "${formItem.name}" dari kategori "${formItem.category}".\n\n(Implementasi navigasi ke halaman pengisian form untuk ID: ${formItem.id} di sini)`
    );
    // Contoh navigasi:
    // navigation.navigate('SpecificFormFillingScreen', { formId: formItem.id, formName: formItem.name });
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
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
      textAlign: 'left',
    },
    listContentContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 24,
      flexGrow: 1, 
    },
    formItemCard: {
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
    itemIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22, 
      backgroundColor: `${iconColor}1A`, // Tint background menggunakan iconColor (yang sudah dinamis)
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    itemTextContainer: {
      flex: 1, 
    },
    formName: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginBottom: 2,
    },
    formCategory: {
      fontSize: 13,
      fontFamily: 'Poppins-Regular',
      color: secondaryTextColor,
    },
    chevronContainer: {
      marginLeft: 10,
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

  const renderFormItem = ({ item }: { item: FormListItem }) => (
    <TouchableOpacity
      style={styles.formItemCard}
      onPress={() => handleFormItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemIconContainer}>
        <FileText size={22} color={iconColor} strokeWidth={1.8} /> 
        {/* iconColor sekarang akan biru di light mode jika colors.primary Anda biru */}
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.formName} numberOfLines={2}>{item.name}</Text>
        {item.category && <Text style={styles.formCategory} numberOfLines={1}>{item.category}</Text>}
      </View>
      <View style={styles.chevronContainer}>
        <ChevronRight size={20} color={chevronListItemColor} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Daftar Formulir</Text>
        </View>

        <FlatList
          data={ALL_FORMS_LIST}
          renderItem={renderFormItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
                <Archive size={64} color={colors.border} /> 
                <Text style={styles.emptyStateTextTitle}>Belum Ada Formulir</Text>
                <Text style={styles.emptyStateTextMessage}>Daftar formulir akan muncul di sini.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default FormScreen;