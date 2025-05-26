import React, { useState, useEffect, useMemo } from 'react'; // Tambahkan useEffect dan useMemo
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
import { CheckCircle, MapPin, FileText, ChevronDown, AlertCircle, User, Hash, Building } from 'lucide-react-native'; // Tambahkan ikon lain jika perlu

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

const JENIS_KELAMIN_OPTIONS = [
    { label: 'Pilih Jenis Kelamin...', value: undefined },
    { label: 'Laki-laki', value: 'laki_laki' },
    { label: 'Perempuan', value: 'perempuan' },
];

// --- Definisi Struktur Form Dinamis ---
// Definisikan tipe untuk field dan section
type FormFieldType = 'text' | 'picker' | 'multiline-text' | 'number';

interface FormField {
  name: string; // Harus unik, digunakan sebagai key di state
  label: string;
  type: FormFieldType;
  icon: React.ElementType; // Komponen ikon (mis. FileText, MapPin)
  placeholder?: string;
  options?: Array<{ label: string; value: string | number | undefined }>;
  prompt?: string;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  required?: boolean;
  requiredMessage?: string;
  // Tambahkan properti lain sesuai kebutuhan (mis. validasi regex, minLength, dll.)
}

interface FormSection {
  id: string; // Harus unik
  title: string;
  fields: FormField[];
}

// Konfigurasi Form
const FORM_SECTIONS_CONFIG: FormSection[] = [
  {
    id: 'skCard',
    title: 'SK Desa/Kelurahan',
    fields: [
      {
        name: 'skDocument',
        label: 'Pilihan Dokumen SK',
        type: 'picker',
        icon: FileText,
        options: SK_DOCUMENT_OPTIONS,
        prompt: 'Pilih Dokumen SK',
        required: true,
        requiredMessage: 'Mohon pilih Dokumen SK.',
      },
    ],
  },
  {
    id: 'alamatCard',
    title: 'Alamat Kantor',
    fields: [
      {
        name: 'alamatBalaiDesa',
        label: 'Alamat Lengkap',
        type: 'multiline-text',
        icon: MapPin,
        placeholder: 'Masukkan alamat lengkap...',
        numberOfLines: 4,
        required: true,
        requiredMessage: 'Mohon isi Alamat Balai Desa/Kantor Kelurahan.',
      },
      {
        name: 'kecamatan',
        label: 'Kecamatan',
        type: 'picker',
        icon: MapPin, // Menggunakan MapPin lagi, bisa diganti jika ada ikon yang lebih spesifik
        options: KECAMATAN_OPTIONS,
        prompt: 'Pilih Nama Kecamatan',
        required: true,
        requiredMessage: 'Mohon pilih Nama Kecamatan.',
      },
    ],
  },
  // Contoh Penambahan Kartu dan Input Baru (mis. Data Kepala Desa)
  {
    id: 'kepalaDesaCard',
    title: 'Data Kepala Desa/Lurah',
    fields: [
        {
            name: 'namaKepalaDesa',
            label: 'Nama Lengkap Kepala Desa/Lurah',
            type: 'text',
            icon: User,
            placeholder: 'Masukkan nama lengkap...',
            required: true,
            requiredMessage: 'Nama Kepala Desa/Lurah wajib diisi.',
        },
        {
            name: 'nikKepalaDesa',
            label: 'NIK Kepala Desa/Lurah',
            type: 'number',
            icon: Hash,
            placeholder: 'Masukkan NIK...',
            keyboardType: 'numeric',
            required: true,
            requiredMessage: 'NIK Kepala Desa/Lurah wajib diisi.',
        },
        {
            name: 'jenisKelaminKepalaDesa',
            label: 'Jenis Kelamin',
            type: 'picker',
            icon: User, // Bisa diganti dengan ikon yang lebih spesifik
            options: JENIS_KELAMIN_OPTIONS,
            prompt: 'Pilih Jenis Kelamin',
            required: false, // Contoh field tidak wajib
        },
    ]
  }
];


// --- Interface (yang sudah ada bisa tetap, atau disesuaikan jika perlu) ---
interface KeteranganTempatScreenProps {
  route?: { params?: { formTitle?: string } };
}

// Props untuk komponen kustom tidak berubah banyak
interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

interface CustomPickerProps {
  label: string;
  selectedValue: any; // Bisa string, number, atau undefined
  onValueChange: (itemValue: any) => void;
  items: Array<{ label: string; value: any }>;
  prompt?: string;
  icon: React.ReactNode;
  error?: string;
}

interface CustomTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string; // Dibuat opsional
  icon: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  error?: string;
}

// --- Reusable Components (FormCard, CustomPicker, CustomTextInput) ---
// Tidak ada perubahan signifikan pada definisi komponen ini, hanya penggunaannya yang akan dinamis
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

const CustomPicker: React.FC<CustomPickerProps> = React.memo(({ // React.memo untuk optimasi
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
          color: error ? colors.notification : colors.text,
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
                key={option.value !== undefined ? option.value.toString() : `picker-item-${index}`}
                label={option.label}
                value={option.value}
                style={
                  option.value === undefined
                    ? styles.pickerPlaceholder
                    : { fontFamily: 'Poppins-Regular', color: colors.text }
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
});

const CustomTextInput: React.FC<CustomTextInputProps> = React.memo(({ // React.memo untuk optimasi
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
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
    error ? {color: colors.notification} : {}
  ];

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={inputContainerStyle}>
        {React.cloneElement(icon as React.ReactElement, {
          size: 20,
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
          keyboardType={keyboardType}
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
});

// --- Main Screen Component ---
const KeteranganTempatScreen = ({ route }: KeteranganTempatScreenProps) => {
  const { colors, dark: isDarkMode } = useTheme();
  const styles = createStyles(colors, isDarkMode);
  const screenTitle = route?.params?.formTitle || 'Keterangan Tempat';

  // Membuat initial state untuk formData dan errors secara dinamis
  const initialFormData = useMemo(() => {
    const data: { [key: string]: any } = {};
    FORM_SECTIONS_CONFIG.forEach(section => {
      section.fields.forEach(field => {
        data[field.name] = field.type === 'picker' ? undefined : ''; // Default untuk picker adalah undefined
      });
    });
    return data;
  }, []);

  const [formData, setFormData] = useState<{ [key: string]: any }>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

  // Handler input generik
  const handleInputChange = (name: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    // Hapus error untuk field yang sedang diubah
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string | undefined } = {};
    let isValid = true;

    FORM_SECTIONS_CONFIG.forEach(section => {
      section.fields.forEach(field => {
        if (field.required) {
          const value = formData[field.name];
          if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
            newErrors[field.name] = field.requiredMessage || `${field.label} wajib diisi.`;
            isValid = false;
          }
        }
        // Tambahkan aturan validasi lain di sini jika perlu
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert('Data Belum Lengkap', 'Silakan periksa kembali data yang Anda masukkan.');
      return;
    }
    console.log('Data Formulir Dinamis:', formData);
    Alert.alert('Berhasil', 'Data keterangan tempat (dinamis) telah disimulasikan untuk dikirim!');
    // Reset form (opsional)
    // setFormData(initialFormData);
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

          {/* Rendering Form Secara Dinamis */}
          {FORM_SECTIONS_CONFIG.map(section => (
            <FormCard key={section.id} title={section.title}>
              {section.fields.map(field => {
                const IconComponent = field.icon; // Ambil komponen ikon dari konfigurasi
                if (field.type === 'picker') {
                  return (
                    <CustomPicker
                      key={field.name}
                      label={field.label}
                      selectedValue={formData[field.name]}
                      onValueChange={(value) => handleInputChange(field.name, value)}
                      items={field.options || []}
                      prompt={field.prompt}
                      icon={<IconComponent />} // Render ikon
                      error={errors[field.name]}
                    />
                  );
                }
                // Untuk 'text' dan 'multiline-text' atau 'number'
                return (
                  <CustomTextInput
                    key={field.name}
                    label={field.label}
                    value={String(formData[field.name] || '')} // Pastikan value selalu string atau default ke string kosong
                    onChangeText={(text) => handleInputChange(field.name, text)}
                    placeholder={field.placeholder}
                    icon={<IconComponent />} // Render ikon
                    multiline={field.type === 'multiline-text'}
                    numberOfLines={field.numberOfLines}
                    keyboardType={field.keyboardType || (field.type === 'number' ? 'numeric' : 'default')}
                    error={errors[field.name]}
                  />
                );
              })}
            </FormCard>
          ))}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.7}>
            <CheckCircle size={22} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Submit Data</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Stylesheet (createStyles function) ---
// Fungsi createStyles tetap sama, tidak perlu diubah
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
      fontSize: 24,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
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
    inputErrorBorder: {
        borderColor: colors.notification,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    errorText: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: colors.notification,
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
    },
    pickerPlaceholder: {
      fontFamily: 'Poppins-Regular',
      color: isDarkMode ? '#888888' : '#AAAAAA',
    },
    pickerIcon: {
      position: 'absolute',
      right: 15,
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