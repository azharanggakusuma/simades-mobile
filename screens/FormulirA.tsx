import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { CheckCircle, MapPin, FileText, ChevronDown, AlertCircle } from 'lucide-react-native';

// --- Constants (Data bisa dipindah ke file terpisah jika makin banyak) ---
const SK_DOCUMENT_OPTIONS = [
  { label: 'Pilih Dokumen SK...', value: undefined },
  { label: 'SK Bupati Pembentukan Desa', value: 'sk_bupati_pembentukan' },
  { label: 'SK Gubernur Pengesahan Kelurahan', value: 'sk_gubernur_pengesahan' },
  { label: 'Peraturan Desa tentang Batas Wilayah', value: 'perdes_batas' },
  { label: 'Lainnya', value: 'lainnya' },
];

const KECAMATAN_OPTIONS = [
  { label: 'Pilih Kecamatan...', value: undefined },
  { label: 'Kecamatan Kesambi', value: 'kesambi' },
  { label: 'Kecamatan Pekalipan', value: 'pekalipan' },
  { label: 'Kecamatan Harjamukti', value: 'harjamukti' },
  { label: 'Kecamatan Lemahwungkuk', value: 'lemahwungkuk' },
  { label: 'Kecamatan Kejaksan', value: 'kejaksan' },
];

// --- Interface ---
interface KeteranganTempatScreenProps {
  route?: { params?: { formTitle?: string } };
}

interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

interface CustomPickerProps {
  label: string;
  selectedValue: string | undefined;
  onValueChange: (itemValue: string | undefined) => void;
  items: Array<{ label: string; value: string | undefined }>;
  prompt?: string;
  icon: React.ReactNode;
  error?: string;
}

interface CustomTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
}

// --- Reusable Components ---

const FormCard: React.FC<FormCardProps> = ({ title, children }) => {
  const { colors, dark: isDarkMode } = useTheme();
  const styles = createStyles(colors, isDarkMode);
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

const CustomPicker: React.FC<CustomPickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  items,
  prompt,
  icon,
  error,
}) => {
  const { colors, dark: isDarkMode } = useTheme();
  const styles = createStyles(colors, isDarkMode);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.pickerWrapper, error ? styles.inputErrorBorder : {}]}>
        {React.cloneElement(icon as React.ReactElement, {
          size: 20,
          color: error ? colors.notification : colors.text, // Ganti warna ikon jika ada error
          style: { marginLeft: 15, marginRight: 5 },
        })}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={styles.picker}
            prompt={prompt}
            dropdownIconColor={colors.text}
          >
            {items.map((option, index) => (
              <Picker.Item
                key={option.value || `picker-item-${index}`}
                label={option.label}
                value={option.value}
                style={
                  option.value === undefined
                    ? styles.pickerPlaceholder
                    : { fontFamily: 'Poppins-Regular', color: colors.text } // Pastikan warna teks item juga dari tema
                }
              />
            ))}
          </Picker>
        </View>
        {Platform.OS === 'ios' && <ChevronDown size={20} style={styles.pickerIcon} color={colors.text} />}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color={colors.notification} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  multiline = false,
  numberOfLines = 1,
  error,
}) => {
  const { colors, dark: isDarkMode } = useTheme();
  const styles = createStyles(colors, isDarkMode);

  const inputContainerStyle = [
    styles.inputContainer,
    multiline && styles.multilineTextInputContainer,
    error ? styles.inputErrorBorder : {}
  ];

  const iconStyle = [
    styles.inputIcon,
    multiline && { marginTop: Platform.OS === 'ios' ? 14 : 12 },
    error ? {color: colors.notification} : {} // Ganti warna ikon jika ada error
  ];


  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={inputContainerStyle}>
        {React.cloneElement(icon as React.ReactElement, {
          size: 20,
        //   color: colors.text, // Warna diatur oleh iconStyle
          style: iconStyle,
        })}
        <TextInput
          style={[styles.textInput, multiline && styles.multilineTextInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#999999' : '#AAAAAA'}
          multiline={multiline}
          numberOfLines={numberOfLines}
          selectionColor={colors.primary}
        />
      </View>
      {error && (
         <View style={styles.errorContainer}>
          <AlertCircle size={14} color={colors.notification} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

// --- Main Screen Component ---
const KeteranganTempatScreen = ({ route }: KeteranganTempatScreenProps) => {
  const { colors, dark: isDarkMode } = useTheme();
  const styles = createStyles(colors, isDarkMode); // Panggil createStyles
  const screenTitle = route?.params?.formTitle || 'Keterangan Tempat';

  // State untuk input
  const [selectedSkDocument, setSelectedSkDocument] = useState<string | undefined>();
  const [alamatBalaiDesa, setAlamatBalaiDesa] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | undefined>();

  // State untuk error (opsional, untuk UI error yang lebih baik dari Alert)
  const [errors, setErrors] = useState<{ sk?: string; alamat?: string; kecamatan?: string }>({});


  const validate = () => {
    const newErrors: { sk?: string; alamat?: string; kecamatan?: string } = {};
    if (!selectedSkDocument) {
      newErrors.sk = 'Mohon pilih Dokumen SK.';
    }
    if (!alamatBalaiDesa.trim()) {
      newErrors.alamat = 'Mohon isi Alamat Balai Desa/Kantor Kelurahan.';
    }
    if (!selectedKecamatan) {
      newErrors.kecamatan = 'Mohon pilih Nama Kecamatan.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = () => {
    if (!validate()) {
      // Alert.alert('Data Belum Lengkap', 'Silakan periksa kembali data yang Anda masukkan.');
      // Bisa juga menampilkan toast atau Snackbar
      // Untuk saat ini, error inline sudah cukup
      return;
    }

    const formData = {
      skDokumen: selectedSkDocument,
      alamat: alamatBalaiDesa,
      kecamatan: selectedKecamatan,
    };
    console.log('Data Formulir:', formData);
    Alert.alert('Berhasil', 'Data keterangan tempat telah disimulasikan untuk dikirim!');
    // Implementasi logika submit data
    // Reset form setelah submit berhasil (opsional)
    // setSelectedSkDocument(undefined);
    // setAlamatBalaiDesa('');
    // setSelectedKecamatan(undefined);
    // setErrors({});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>{screenTitle}</Text>

          <FormCard title="SK Desa/Kelurahan">
            <CustomPicker
              label="Pilihan Dokumen SK"
              selectedValue={selectedSkDocument}
              onValueChange={(value) => {
                setSelectedSkDocument(value);
                if (errors.sk) setErrors(prev => ({...prev, sk: undefined}));
              }}
              items={SK_DOCUMENT_OPTIONS}
              prompt="Pilih Dokumen SK"
              icon={<FileText />}
              error={errors.sk}
            />
          </FormCard>

          <FormCard title="Alamat Kantor">
            <CustomTextInput
              label="Alamat Lengkap"
              value={alamatBalaiDesa}
              onChangeText={(text) => {
                setAlamatBalaiDesa(text);
                if (errors.alamat) setErrors(prev => ({...prev, alamat: undefined}));
              }}
              placeholder="Masukkan alamat lengkap..."
              icon={<MapPin />}
              multiline
              numberOfLines={4}
              error={errors.alamat}
            />
            <CustomPicker
              label="Kecamatan"
              selectedValue={selectedKecamatan}
              onValueChange={(value) => {
                setSelectedKecamatan(value);
                if (errors.kecamatan) setErrors(prev => ({...prev, kecamatan: undefined}));
              }}
              items={KECAMATAN_OPTIONS}
              prompt="Pilih Nama Kecamatan"
              icon={<MapPin />}
              error={errors.kecamatan}
            />
          </FormCard>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.7}>
            <CheckCircle size={22} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Submit Data</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Stylesheet ---
// Mengubah StyleSheet menjadi fungsi agar bisa menerima `colors` dan `isDarkMode`
const createStyles = (colors: any, isDarkMode: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollViewContainer: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    screenTitle: {
      fontSize: 28,
      fontFamily: 'Poppins-Bold',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 30,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 8,
    },
    fieldGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 15,
      fontFamily: 'Poppins-Medium',
      color: colors.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.border : '#FFFFFF',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
    },
    inputErrorBorder: { // Style untuk border error
        borderColor: colors.notification, // Biasanya warna merah untuk error
    },
    errorContainer: { // Container untuk teks error
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    errorText: { // Style untuk teks error
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: colors.notification, // Biasanya warna merah untuk error
        marginLeft: 5,
    },
    inputIcon: {
      marginRight: 10,
      color: colors.text,
    },
    textInput: {
      flex: 1,
      color: colors.text,
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    },
    multilineTextInputContainer: {
      minHeight: 120,
      alignItems: 'flex-start',
    },
    multilineTextInput: {
      textAlignVertical: 'top',
      paddingTop: Platform.OS === 'ios' ? 14 : 12,
    },
    pickerWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.border : '#FFFFFF',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
    },
    pickerContainer: {
      flex: 1,
    },
    picker: {
      color: colors.text,
      fontFamily: 'Poppins-Regular',
      height: Platform.OS === 'android' ? 50 : undefined,
       // Untuk iOS, atur padding atau height pada wrapper jika perlu
       // width: '100%' // pastikan picker mengisi wrapper
    },
    pickerPlaceholder: {
      fontFamily: 'Poppins-Regular',
      color: isDarkMode ? '#888888' : '#AAAAAA',
    },
    pickerIcon: {
      position: 'absolute',
      right: 15,
      top: Platform.OS === 'ios' ? 'auto' : 16, // Biarkan iOS mengatur sendiri atau sesuaikan
      // color: colors.text, // warna sudah diatur saat pemanggilan komponen
    },
    submitButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 8,
      marginTop: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 6,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontFamily: 'Poppins-Bold',
      marginLeft: 10,
    },
  });

export default KeteranganTempatScreen;