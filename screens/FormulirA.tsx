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
import { Picker } from '@react-native-picker/picker'; // Pastikan sudah diinstal
import { CheckCircle } from 'lucide-react-native'; // Ikon untuk tombol submit

interface KeteranganTempatScreenProps {
  route?: { params?: { formTitle?: string } };
}

const KeteranganTempatScreen = ({ route }: KeteranganTempatScreenProps) => {
  const { colors, dark: isDarkMode } = useTheme();
  // Judul utama layar, bisa dari navigasi atau default
  const screenTitle = route?.params?.formTitle || "Keterangan Tempat";

  // State untuk input
  const [selectedSkDocument, setSelectedSkDocument] = useState<string | undefined>();
  const [alamatBalaiDesa, setAlamatBalaiDesa] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | undefined>();

  // Opsi untuk Picker (contoh data)
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

  // Stylesheet yang disesuaikan untuk desain minimalis
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
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    screenTitle: {
      fontSize: 26, // Sedikit lebih kecil
      fontFamily: 'Poppins-Bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 28, // Sedikit dikurangi
    },
    sectionContainer: {
      marginBottom: 24, // Sedikit dikurangi
    },
    sectionTitle: {
      fontSize: 16, // Sedikit lebih kecil
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginBottom: 12, // Sedikit dikurangi
    },
    fieldGroup: {
      marginBottom: 16, // Sedikit dikurangi
    },
    label: {
      fontSize: 14, // Sedikit lebih kecil
      fontFamily: 'Poppins-Medium',
      color: colors.text,
      marginBottom: 6, // Sedikit dikurangi
    },
    textInput: {
      backgroundColor: colors.card,
      color: colors.text,
      fontFamily: 'Poppins-Regular',
      fontSize: 15, // Ukuran font input standar
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 6, // Sudut lebih halus
      paddingHorizontal: 12, // Padding horizontal sedikit dikurangi
      paddingVertical: Platform.OS === 'ios' ? 12 : 10, // Padding vertikal disesuaikan
    },
    multilineTextInput: {
      minHeight: 100,
      textAlignVertical: 'top',
      paddingTop: Platform.OS === 'ios' ? 12 : 10, // Padding atas konsisten dengan textInput
    },
    pickerContainer: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 6, // Sudut lebih halus, konsisten dengan textInput
      overflow: 'hidden',
    },
    picker: {
      color: colors.text,
      height: Platform.OS === 'android' ? 50 : undefined, // Tinggi Picker Android disesuaikan
      // Untuk iOS, tinggi akan menyesuaikan konten.
    },
    submitButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12, // Padding vertikal tombol sedikit dikurangi
      borderRadius: 6, // Sudut lebih halus, konsisten dengan input
      marginTop: 20, // Margin atas sedikit dikurangi
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 16, // Sedikit lebih kecil
      fontFamily: 'Poppins-SemiBold',
      marginLeft: 8, // Jarak ikon ke teks sedikit dikurangi
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
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>SK Pembentukan/Pengesahan Desa/Kelurahan</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Pilihan Dokumen SK</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedSkDocument}
                  onValueChange={(itemValue) => setSelectedSkDocument(itemValue)}
                  style={styles.picker}
                  prompt="Pilih Dokumen SK"
                >
                  {skDocumentOptions.map((option) => (
                    <Picker.Item key={option.value || "sk-default"} label={option.label} value={option.value} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Bagian Alamat Balai Desa/Kantor Kelurahan */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Alamat Balai Desa/Kantor Kelurahan</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Alamat Lengkap</Text>
              <TextInput
                style={[styles.textInput, styles.multilineTextInput]}
                value={alamatBalaiDesa}
                onChangeText={setAlamatBalaiDesa}
                placeholder="Masukkan alamat lengkap balai desa/kantor kelurahan"
                placeholderTextColor={isDarkMode ? '#999999' : '#AAAAAA'}
                multiline
                selectionColor={colors.primary}
              />
            </View>
          </View>

          {/* Bagian Nama Kecamatan */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Nama Kecamatan</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Pilihan Kecamatan</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedKecamatan}
                  onValueChange={(itemValue) => setSelectedKecamatan(itemValue)}
                  style={styles.picker}
                  prompt="Pilih Nama Kecamatan"
                >
                  {kecamatanOptions.map((option) => (
                    <Picker.Item key={option.value || "kec-default"} label={option.label} value={option.value} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Tombol Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
            <CheckCircle size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Submit Data</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default KeteranganTempatScreen;