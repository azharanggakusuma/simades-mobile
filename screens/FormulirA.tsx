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
import { CheckCircle, MapPin, FileText, ChevronDown } from 'lucide-react-native'; // Menambahkan ikon

interface KeteranganTempatScreenProps {
  route?: { params?: { formTitle?: string } };
}

const KeteranganTempatScreen = ({ route }: KeteranganTempatScreenProps) => {
  const { colors, dark: isDarkMode } = useTheme();
  const screenTitle = route?.params?.formTitle || "Keterangan Tempat";

  // State untuk input
  const [selectedSkDocument, setSelectedSkDocument] = useState<string | undefined>();
  const [alamatBalaiDesa, setAlamatBalaiDesa] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | undefined>();

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
    if (!selectedSkDocument) {
      Alert.alert("Data Belum Lengkap", "Mohon pilih Dokumen SK.");
      return;
    }
    if (!alamatBalaiDesa.trim()) {
      Alert.alert("Data Belum Lengkap", "Mohon isi Alamat Balai Desa/Kantor Kelurahan.");
      return;
    }
    if (!selectedKecamatan) {
      Alert.alert("Data Belum Lengkap", "Mohon pilih Nama Kecamatan.");
      return;
    }

    const formData = {
      skDokumen: selectedSkDocument,
      alamat: alamatBalaiDesa,
      kecamatan: selectedKecamatan,
    };
    console.log("Data Formulir:", formData);
    Alert.alert("Berhasil", "Data keterangan tempat telah disimulasikan untuk dikirim!");
    // Implementasi logika submit data
  };

  // Stylesheet yang disesuaikan untuk desain baru
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background, // Warna latar belakang dari tema
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollViewContainer: {
      flexGrow: 1,
      paddingHorizontal: 16, // Padding horizontal untuk konten scroll
      paddingVertical: 20,
    },
    screenTitle: {
      fontSize: 28, // Ukuran font judul layar lebih besar
      fontFamily: 'Poppins-Bold',
      color: colors.primary, // Warna judul menggunakan warna primer tema
      textAlign: 'center',
      marginBottom: 30, // Margin bawah lebih besar
    },
    // Gaya untuk setiap kartu bagian
    card: {
      backgroundColor: colors.card, // Warna latar kartu dari tema
      borderRadius: 12, // Sudut kartu lebih bulat
      padding: 20, // Padding di dalam kartu
      marginBottom: 24, // Margin bawah antar kartu
      shadowColor: '#000', // Warna bayangan
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDarkMode ? 0.3 : 0.1, // Opasitas bayangan berbeda untuk mode gelap/terang
      shadowRadius: 4,
      elevation: 3, // Elevasi untuk Android
    },
    sectionTitle: {
      fontSize: 18, // Ukuran font judul bagian lebih besar
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginBottom: 16,
      borderBottomWidth: 1, // Garis bawah tipis untuk memisahkan judul bagian
      borderBottomColor: colors.border,
      paddingBottom: 8,
    },
    fieldGroup: {
      marginBottom: 20, // Margin bawah untuk setiap grup field
    },
    label: {
      fontSize: 15, // Ukuran font label
      fontFamily: 'Poppins-Medium',
      color: colors.text,
      marginBottom: 8,
    },
    // Kontainer untuk input teks dan ikon
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.border : '#FFFFFF', // Latar belakang input field
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8, // Sudut input field lebih bulat
      paddingHorizontal: 12, // Padding horizontal di dalam input container
    },
    inputIcon: {
      marginRight: 10, // Jarak kanan ikon dari teks input
      color: colors.text, // Warna ikon menyesuaikan tema
    },
    textInput: {
      flex: 1, // Agar TextInput mengisi sisa ruang
      color: colors.text,
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      paddingVertical: Platform.OS === 'ios' ? 14 : 12, // Padding vertikal disesuaikan
    },
    multilineTextInputContainer: {
        minHeight: 120, // Tinggi minimum untuk input multi-baris
        alignItems: 'flex-start', // Ratakan ikon ke atas untuk input multi-baris
    },
    multilineTextInput: {
      textAlignVertical: 'top', // Teks mulai dari atas untuk multi-baris
      paddingTop: Platform.OS === 'ios' ? 14 : 12,
    },
    // Pembungkus untuk Picker dan ikon dropdown kustom
    pickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDarkMode ? colors.border : '#FFFFFF',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
    },
    // Kontainer untuk komponen Picker itu sendiri
    pickerContainer: {
      flex: 1,
    },
    picker: {
      color: colors.text,
      fontFamily: 'Poppins-Regular', // Konsistensi font
      height: Platform.OS === 'android' ? 50 : undefined,
    },
    // Gaya untuk item placeholder di Picker
    pickerPlaceholder: {
        fontFamily: 'Poppins-Regular',
        color: isDarkMode ? '#888888' : '#AAAAAA', // Warna placeholder lebih lembut
    },
    // Ikon dropdown untuk Picker (terutama untuk iOS)
    pickerIcon: {
        position: 'absolute', // Posisi absolut untuk menempatkan di kanan
        right: 15,
        top: Platform.OS === 'ios' ? 15 : 16, // Sesuaikan posisi vertikal
        color: colors.text,
    },
    submitButton: {
      backgroundColor: colors.primary, // Warna tombol submit dari tema
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16, // Padding vertikal lebih besar untuk tombol yang lebih menonjol
      borderRadius: 8, // Sudut tombol lebih bulat
      marginTop: 24,
      shadowColor: colors.primary, // Bayangan tombol menggunakan warna primer
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 6, // Elevasi untuk Android
    },
    submitButtonText: {
      color: '#FFFFFF', // Warna teks tombol putih
      fontSize: 17, // Ukuran font teks tombol
      fontFamily: 'Poppins-Bold', // Font tebal untuk teks tombol
      marginLeft: 10, // Jarak teks dari ikon
    },
  });

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

          {/* Bagian SK Pembentukan/Pengesahan */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>SK Desa/Kelurahan</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Pilihan Dokumen SK</Text>
              {/* Menggunakan pickerWrapper untuk styling yang konsisten */}
              <View style={styles.pickerWrapper}>
                <FileText size={20} color={colors.text} style={{ marginLeft: 15, marginRight: 5}} />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedSkDocument}
                    onValueChange={(itemValue) => setSelectedSkDocument(itemValue)}
                    style={styles.picker}
                    prompt="Pilih Dokumen SK"
                    dropdownIconColor={colors.text} // Warna ikon dropdown untuk Android
                  >
                    {skDocumentOptions.map((option, index) => (
                      <Picker.Item
                        key={option.value || `sk-default-${index}`} // Kunci unik
                        label={option.label}
                        value={option.value}
                        // Terapkan gaya placeholder jika item adalah placeholder
                        style={option.value === undefined ? styles.pickerPlaceholder : { fontFamily: 'Poppins-Regular' }}
                      />
                    ))}
                  </Picker>
                </View>
                {/* Tampilkan ikon ChevronDown untuk iOS sebagai indikator visual */}
                {Platform.OS === 'ios' && <ChevronDown size={20} style={styles.pickerIcon} />}
              </View>
            </View>
          </View>

          {/* Bagian Alamat Balai Desa/Kantor Kelurahan */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Alamat Kantor</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Alamat Lengkap</Text>
              <View style={[styles.inputContainer, styles.multilineTextInputContainer]}>
                {/* Ikon untuk field alamat */}
                <MapPin size={20} color={colors.text} style={[styles.inputIcon, { marginTop: Platform.OS === 'ios' ? 14 : 12 }]} />
                <TextInput
                  style={[styles.textInput, styles.multilineTextInput]}
                  value={alamatBalaiDesa}
                  onChangeText={setAlamatBalaiDesa}
                  placeholder="Masukkan alamat lengkap..."
                  placeholderTextColor={isDarkMode ? '#999999' : '#AAAAAA'}
                  multiline
                  numberOfLines={4} // Saran jumlah baris
                  selectionColor={colors.primary} // Warna kursor
                />
              </View>
            </View>
          </View>

          {/* Bagian Nama Kecamatan */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Kecamatan</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Pilihan Kecamatan</Text>
              <View style={styles.pickerWrapper}>
                 <MapPin size={20} color={colors.text} style={{ marginLeft: 15, marginRight: 5 }} />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedKecamatan}
                    onValueChange={(itemValue) => setSelectedKecamatan(itemValue)}
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
          </View>

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