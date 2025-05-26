// KeteranganTempatScreen.tsx (Dasar yang Rapi & Sederhana)

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

  // Stylesheet yang sangat mendasar dan rapi
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollViewContainer: {
      flexGrow: 1, // Memastikan konten bisa di-scroll jika panjang
      paddingHorizontal: 20, // Padding kiri-kanan untuk konten
      paddingVertical: 24,   // Padding atas-bawah untuk konten
    },
    screenTitle: {
      fontSize: 28, // Ukuran judul yang jelas
      fontFamily: 'Poppins-Bold', // Menggunakan Poppins (pastikan sudah ada)
      color: colors.text,
      textAlign: 'center', // Judul di tengah untuk kesan formal
      marginBottom: 32,   // Jarak yang cukup setelah judul
    },
    // Kontainer untuk setiap bagian form (SK, Alamat, Kecamatan)
    sectionContainer: {
      marginBottom: 28, // Jarak antar bagian form
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginBottom: 16, // Jarak dari judul bagian ke input pertama
    },
    // Grup untuk setiap pasangan label dan input
    fieldGroup: {
      marginBottom: 20, // Jarak antar field input
    },
    label: {
      fontSize: 15,
      fontFamily: 'Poppins-Medium',
      color: colors.text, // Warna teks label standar
      marginBottom: 8,    // Jarak dari label ke input box
    },
    // Styling dasar untuk TextInput
    textInput: {
      backgroundColor: colors.card, // Background input agar sedikit berbeda dari layar
      color: colors.text,
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      borderWidth: 1,
      borderColor: colors.border, // Border standar
      borderRadius: 8,          // Sudut sedikit membulat
      paddingHorizontal: 14,    // Padding dalam input
      paddingVertical: Platform.OS === 'ios' ? 15 : 12, // Sesuaikan padding per platform
    },
    multilineTextInput: {
      minHeight: 100,             // Tinggi minimal untuk input multi-baris
      textAlignVertical: 'top',   // Teks mulai dari atas untuk multi-baris
      paddingTop: Platform.OS === 'ios' ? 15 : 12, // Padding atas konsisten
    },
    // Wrapper untuk Picker agar bisa diberi style border, dll.
    pickerContainer: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      overflow: 'hidden', // Penting agar borderRadius bekerja di Android
    },
    picker: {
      color: colors.text,
      height: Platform.OS === 'android' ? 52 : undefined, // Tinggi standar Picker di Android
      // Untuk iOS, tinggi akan menyesuaikan konten.
    },
    // Tombol Submit
    submitButton: {
      backgroundColor: colors.primary, // Warna primer untuk tombol aksi
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,      // Padding vertikal tombol
      borderRadius: 10,         // Sudut tombol yang membulat
      marginTop: 24,            // Jarak dari elemen form terakhir
    },
    submitButtonText: {
      color: '#FFFFFF',           // Warna teks tombol (biasanya putih)
      fontSize: 17,
      fontFamily: 'Poppins-SemiBold',
      marginLeft: 10,             // Jarak ikon ke teks
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
          showsVerticalScrollIndicator={false} // Sembunyikan scrollbar untuk tampilan bersih
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
                  prompt="Pilih Dokumen SK" // Untuk dialog Picker di Android
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
                selectionColor={colors.primary} // Warna kursor dan seleksi teks
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