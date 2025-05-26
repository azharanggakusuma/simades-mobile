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
  LayoutAnimation, // Untuk animasi buka/tutup (opsional)
  UIManager, // Untuk LayoutAnimation di Android (opsional)
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { CheckCircle, MapPin, FileText, ChevronDown, ChevronUp } from 'lucide-react-native'; // Menambahkan ChevronUp

// Aktifkan LayoutAnimation untuk Android (opsional, untuk animasi)
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface KeteranganTempatScreenProps {
  route?: { params?: { formTitle?: string } };
}

// Definisikan tipe untuk formData agar lebih terstruktur
interface FormData {
  selectedSkDocument: string | undefined;
  alamatBalaiDesa: string;
  selectedKecamatan: string | undefined;
  // Tambahkan field lain di sini jika ada
}

// Definisikan tipe untuk status ekspansi section
interface ExpandedSections {
  sk: boolean;
  alamat: boolean;
  kecamatan: boolean;
  // Tambahkan section lain di sini jika ada
}

const KeteranganTempatScreen = ({ route }: KeteranganTempatScreenProps) => {
  const { colors, dark: isDarkMode } = useTheme();
  const screenTitle = route?.params?.formTitle || "Keterangan Tempat";

  // State untuk input menggunakan satu objek
  const [formData, setFormData] = useState<FormData>({
    selectedSkDocument: undefined,
    alamatBalaiDesa: '',
    selectedKecamatan: undefined,
  });

  // State untuk mengontrol bagian mana yang terbuka (expanded)
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    sk: true, // Default: bagian SK terbuka
    alamat: true, // Default: bagian Alamat terbuka
    kecamatan: true, // Default: bagian Kecamatan terbuka
  });

  // Fungsi untuk menangani perubahan input dan memperbarui formData
  const handleInputChange = (name: keyof FormData, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fungsi untuk toggle buka/tutup bagian accordion
  const toggleSection = (section: keyof ExpandedSections) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animasi (opsional)
    setExpandedSections(prevSections => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };


  // Opsi untuk Picker
  const skDocumentOptions = [
    { label: "Pilih Dokumen SK...", value: undefined },
    { label: "SK Bupati Pembentukan Desa", value: "sk_bupati_pembentukan" },
    { label: "SK Gubernur Pengesahan Kelurahan", value: "sk_gubernur_pengesahan" },
    { label: "Peraturan Desa tentang Batas Wilayah", value: "perdes_batas" },
    { label: "Lainnya", value: "lainnya" },
  ];

  const kecamatanOptions = [
    { label: "Pilih Kecamatan...", value: undefined },
    { label: "Kecamatan Kesambi", value: "kesambi" },
    { label: "Kecamatan Pekalipan", value: "pekalipan" },
    { label: "Kecamatan Harjamukti", value: "harjamukti" },
    { label: "Kecamatan Lemahwungkuk", value: "lemahwungkuk" },
    { label: "Kecamatan Kejaksan", value: "kejaksan" },
  ];

  const handleSubmit = () => {
    if (!formData.selectedSkDocument) {
      Alert.alert("Data Belum Lengkap", "Mohon pilih Dokumen SK.");
      return;
    }
    if (!formData.alamatBalaiDesa.trim()) {
      Alert.alert("Data Belum Lengkap", "Mohon isi Alamat Balai Desa/Kantor Kelurahan.");
      return;
    }
    if (!formData.selectedKecamatan) {
      Alert.alert("Data Belum Lengkap", "Mohon pilih Nama Kecamatan.");
      return;
    }

    console.log("Data Formulir:", formData);
    Alert.alert("Berhasil", "Data keterangan tempat telah disimulasikan untuk dikirim!");
  };

  const styles = StyleSheet.create({
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
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden', // Penting untuk animasi dan border radius pada konten
    },
    // Section title yang bisa diklik
    sectionTitleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20, // Padding dipindahkan ke sini dari card untuk header
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitleText: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      flex: 1, // Agar teks mengambil ruang sisa
    },
    sectionContent: {
        paddingHorizontal: 20, // Padding untuk konten di dalam kartu
        paddingTop: 0, // Dihilangkan karena header sudah punya padding
        paddingBottom: 20, // Padding bawah untuk konten
    },
    fieldGroup: {
      marginTop: 16, // Dulu marginBottom, sekarang marginTop untuk field pertama setelah judul
      marginBottom:0, // Margin bawah di field group terakhir dalam section content di-nolkan jika perlu
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
        top: Platform.OS === 'ios' ? 15 : 16,
        color: colors.text,
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
      shadowOffset: {
        width: 0,
        height: 4,
      },
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

  // Komponen reusable untuk bagian Accordion Card
  const AccordionCard: React.FC<{
    title: string;
    sectionKey: keyof ExpandedSections;
    children: React.ReactNode;
  }> = ({ title, sectionKey, children }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.sectionTitleContainer}
        onPress={() => toggleSection(sectionKey)}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitleText}>{title}</Text>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={24} color={colors.text} />
        ) : (
          <ChevronDown size={24} color={colors.text} />
        )}
      </TouchableOpacity>
      {expandedSections[sectionKey] && (
        <View style={styles.sectionContent}>
            {children}
        </View>
      )}
    </View>
  );


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>{screenTitle}</Text>

          {/* Bagian SK Pembentukan/Pengesahan menggunakan AccordionCard */}
          <AccordionCard title="SK Desa/Kelurahan" sectionKey="sk">
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Pilihan Dokumen SK</Text>
              <View style={styles.pickerWrapper}>
                <FileText size={20} color={colors.text} style={{ marginLeft: 15, marginRight: 5}} />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.selectedSkDocument}
                    onValueChange={(itemValue) => handleInputChange('selectedSkDocument', itemValue)}
                    style={styles.picker}
                    prompt="Pilih Dokumen SK"
                    dropdownIconColor={colors.text}
                  >
                    {skDocumentOptions.map((option, index) => (
                      <Picker.Item
                        key={option.value || `sk-default-${index}`}
                        label={option.label}
                        value={option.value}
                        style={option.value === undefined ? styles.pickerPlaceholder : { fontFamily: 'Poppins-Regular' }}
                      />
                    ))}
                  </Picker>
                </View>
                {Platform.OS === 'ios' && <ChevronDown size={20} style={styles.pickerIcon} />}
              </View>
            </View>
            {/* Tambahkan field lain untuk bagian SK di sini jika ada */}
          </AccordionCard>

          {/* Bagian Alamat menggunakan AccordionCard */}
          <AccordionCard title="Alamat Kantor" sectionKey="alamat">
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Alamat Lengkap</Text>
              <View style={[styles.inputContainer, styles.multilineTextInputContainer]}>
                <MapPin size={20} color={colors.text} style={[styles.inputIcon, { marginTop: Platform.OS === 'ios' ? 14 : 12 }]} />
                <TextInput
                  style={[styles.textInput, styles.multilineTextInput]}
                  value={formData.alamatBalaiDesa}
                  onChangeText={(text) => handleInputChange('alamatBalaiDesa', text)}
                  placeholder="Masukkan alamat lengkap..."
                  placeholderTextColor={isDarkMode ? '#999999' : '#AAAAAA'}
                  multiline
                  numberOfLines={4}
                  selectionColor={colors.primary}
                />
              </View>
            </View>
             {/* Tambahkan field lain untuk bagian Alamat di sini jika ada */}
          </AccordionCard>

          {/* Bagian Kecamatan menggunakan AccordionCard */}
          <AccordionCard title="Kecamatan" sectionKey="kecamatan">
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Pilihan Kecamatan</Text>
              <View style={styles.pickerWrapper}>
                <MapPin size={20} color={colors.text} style={{ marginLeft: 15, marginRight: 5 }} />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.selectedKecamatan}
                    onValueChange={(itemValue) => handleInputChange('selectedKecamatan', itemValue)}
                    style={styles.picker}
                    prompt="Pilih Nama Kecamatan"
                    dropdownIconColor={colors.text}
                  >
                    {kecamatanOptions.map((option, index) => (
                      <Picker.Item
                        key={option.value || `kec-default-${index}`}
                        label={option.label}
                        value={option.value}
                        style={option.value === undefined ? styles.pickerPlaceholder : { fontFamily: 'Poppins-Regular' }}
                      />
                    ))}
                  </Picker>
                </View>
                {Platform.OS === 'ios' && <ChevronDown size={20} style={styles.pickerIcon} />}
              </View>
            </View>
            {/* Tambahkan field lain untuk bagian Kecamatan di sini jika ada */}
          </AccordionCard>

          {/* Tombol Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.7}>
            <CheckCircle size={22} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Submit Data</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default KeteranganTempatScreen;