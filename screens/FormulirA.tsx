// KeteranganTempatScreen.tsx (Redesain Esensial & Fokus)

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
import { Save } from 'lucide-react-native'; // Hanya ikon untuk tombol simpan

interface KeteranganTempatScreenProps {
  route?: { params?: { formName?: string } };
}

const KeteranganTempatScreen = ({ route }: KeteranganTempatScreenProps) => {
  const { colors, dark: isDarkMode } = useTheme();
  const screenTitle = route?.params?.formName || "Detail Lokasi";

  const [alamatBalaiDesa, setAlamatBalaiDesa] = useState('');
  const [namaKecamatan, setNamaKecamatan] = useState('');

  // State untuk fokus input, untuk mengubah warna garis bawah
  const [isAlamatFocused, setIsAlamatFocused] = useState(false);
  const [isKecamatanFocused, setIsKecamatanFocused] = useState(false);

  const handleSimpan = () => {
    if (!alamatBalaiDesa.trim()) {
      Alert.alert('Data Belum Lengkap', 'Mohon isi Alamat Balai Desa/Kantor Kelurahan.');
      return;
    }
    if (!namaKecamatan.trim()) {
      Alert.alert('Data Belum Lengkap', 'Mohon isi Nama Kecamatan.');
      return;
    }
    console.log('Data Disimpan:', { Alamat: alamatBalaiDesa, Kecamatan: namaKecamatan });
    Alert.alert('Berhasil', 'Informasi lokasi telah disimpan (simulasi).');
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    // Kontainer utama untuk scroll view
    scrollViewContainer: {
      flexGrow: 1, // Memastikan konten bisa scroll dan tombol bisa di bawah
      paddingHorizontal: 28, // Padding horizontal lebih lega
      paddingTop: Platform.OS === 'ios' ? 30 : 40, // Padding atas lebih lega
      paddingBottom: 30, // Padding bawah
    },
    // Judul Layar
    screenTitle: {
      fontSize: 30, // Font lebih besar untuk judul
      fontFamily: 'Poppins-Bold', // Tegas
      color: colors.text,
      marginBottom: 40, // Jarak besar setelah judul
      textAlign: 'center', // Judul di tengah untuk kesan formal & bersih
    },
    // Grup Input Field
    fieldGroup: {
      marginBottom: 35, // Jarak antar field lebih besar
    },
    label: {
      fontSize: 15,
      fontFamily: 'Poppins-Medium', // Label yang jelas
      color: isDarkMode ? '#C0C0C0' : '#505050', // Warna label yang lembut
      marginBottom: 12, // Jarak label ke input
    },
    textInput: {
      color: colors.text,
      fontSize: 17, // Ukuran font input yang nyaman dibaca
      fontFamily: 'Poppins-Regular',
      paddingVertical: 14, // Padding vertikal input
      paddingHorizontal: 4, // Sedikit padding horizontal untuk teks
      borderBottomWidth: 1.5, // Hanya garis bawah
      // Warna border diatur dinamis berdasarkan fokus
    },
    multilineTextInput: {
      minHeight: 90, // Tinggi minimal untuk input alamat
      textAlignVertical: 'top',
    },
    // Tombol Simpan
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary, // Warna primer tema
      paddingVertical: 18, // Tombol lebih tinggi
      borderRadius: 12, // Sudut yang lebih membulat
      marginTop: 25, // Jarak dari field terakhir ke tombol
      // Tidak ada shadow/elevation untuk tampilan yang sangat flat
    },
    saveButtonText: {
      color: '#FFFFFF', // Teks putih
      fontSize: 17,
      fontFamily: 'Poppins-SemiBold', // Teks tombol yang jelas
      marginLeft: 10,
    },
    // Spacer untuk mendorong tombol ke bawah jika konten pendek
    spacer: {
      flex: 1,
      minHeight: 20, // Beri tinggi minimal agar berfungsi
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.screenTitle}>{screenTitle}</Text>

          {/* Field Alamat */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Alamat Balai Desa/Kantor Kelurahan</Text>
            <TextInput
              style={[
                styles.textInput,
                styles.multilineTextInput,
                { borderBottomColor: isAlamatFocused ? colors.primary : colors.border }
              ]}
              value={alamatBalaiDesa}
              onChangeText={setAlamatBalaiDesa}
              placeholder="Ketik alamat lengkap di sini"
              placeholderTextColor={isDarkMode ? '#707070' : '#B0B0B0'}
              multiline
              onFocus={() => setIsAlamatFocused(true)}
              onBlur={() => setIsAlamatFocused(false)}
              selectionColor={colors.primary}
            />
          </View>

          {/* Field Kecamatan */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nama Kecamatan</Text>
            <TextInput
              style={[
                styles.textInput,
                { borderBottomColor: isKecamatanFocused ? colors.primary : colors.border }
              ]}
              value={namaKecamatan}
              onChangeText={setNamaKecamatan}
              placeholder="Ketik nama kecamatan"
              placeholderTextColor={isDarkMode ? '#707070' : '#B0B0B0'}
              onFocus={() => setIsKecamatanFocused(true)}
              onBlur={() => setIsKecamatanFocused(false)}
              selectionColor={colors.primary}
            />
          </View>

          {/* Spacer untuk mendorong tombol ke bawah */}
          <View style={styles.spacer} />

          {/* Tombol Simpan */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSimpan} activeOpacity={0.8}>
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Simpan Data</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default KeteranganTempatScreen;