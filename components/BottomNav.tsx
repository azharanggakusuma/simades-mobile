import React, { useRef } from 'react';
import { View, Animated, StyleSheet, TouchableWithoutFeedback, Platform, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, User, Bell, Clock, ClipboardList } from 'lucide-react-native';

// Import screen dan navigator
import SearchScreen from '../screens/SearchScreen';
import FormScreen from '../screens/FormScreen'; // Digunakan oleh FAB
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeStackNavigator from '../navigation/HomeStackNavigator'; // Navigator untuk tab Beranda

const Tab = createBottomTabNavigator();
const darkModeYellowAccent = '#FACC15'; // Warna aksen kuning untuk dark mode

/**
 * Komponen AnimatedFormButton adalah tombol aksi mengambang (FAB) kustom
 * dengan animasi tekan.
 *
 * @param {function} onPress - Fungsi yang dipanggil saat FAB ditekan.
 * @param {boolean} darkMode - Status mode gelap untuk penyesuaian style FAB.
 */
const AnimatedFormButton = ({ onPress, darkMode }) => {
  const scale = useRef(new Animated.Value(1)).current;
  // Warna FAB disesuaikan dengan darkMode, ikon di dalamnya juga
  const fabBackgroundColor = darkMode ? darkModeYellowAccent : '#3b82f6';
  const iconColorInFab = darkMode ? '#1F2937' : '#FFFFFF'; // Warna ikon kontras dengan background FAB

  // Animasi saat FAB ditekan masuk
  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start();
  // Animasi saat FAB dilepas
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start(
      () => {
        if (onPress) onPress();
      }
    );

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.fabWrapper, { transform: [{ scale }] }]}>
        <View style={[styles.fabButton, { backgroundColor: fabBackgroundColor }]}>
          <ClipboardList size={26} color={iconColorInFab} />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

/**
 * Komponen BottomNav menampilkan navigasi tab di bagian bawah layar.
 * Mendukung dark mode dan memiliki FAB kustom.
 *
 * @param {boolean} darkMode - Status mode gelap saat ini.
 */
const BottomNav = ({ darkMode }) => {
  const insets = useSafeAreaInsets(); // Untuk padding berdasarkan safe area
  // Mapping nama rute tab ke komponen ikonnya
  const iconMap = { Beranda: Home, Cari: Search, Riwayat: Clock, Akun: User };

  // Definisi warna dinamis berdasarkan darkMode
  const tabBarBackgroundColor = darkMode ? 'rgba(31, 41, 55, 0.97)' : 'rgba(255,255,255,0.97)'; // Warna dasar #1f2937 (Tailwind gray-800) untuk dark
  const labelColorInactive = darkMode ? '#9CA3AF' : '#6B7280'; // Label tidak aktif (Tailwind gray-400/500)
  const labelColorActive = darkMode ? darkModeYellowAccent : '#3b82f6'; // Label aktif
  const iconColorInactive = darkMode ? '#9CA3AF' : '#9ca3af'; // Ikon tidak aktif
  const iconColorActive = darkMode ? darkModeYellowAccent : '#3b82f6'; // Ikon aktif
  const shadowColor = darkMode ? '#050505' : '#000000'; // Warna bayangan

  return (
    <Tab.Navigator
      screenOptions={({ route, focused }) => ({
        // 'focused' dari screenOptions untuk styling dinamis
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11, // Ukuran font label
          marginBottom: Platform.OS === 'ios' ? 0 : 4, // Jarak bawah label di Android
          fontFamily: focused ? 'Poppins-SemiBold' : 'Poppins-Regular', // Font lebih tebal untuk label aktif
          color: focused ? labelColorActive : labelColorInactive, // Warna label dinamis
        },
        tabBarStyle: {
          // Menggunakan style asli dari user dengan warna dinamis
          position: 'absolute',
          bottom: 8, // Posisi dari bawah layar
          left: 16, // Jarak horizontal dari tepi layar
          right: 16,
          height: 60 + insets.bottom, // Tinggi tab bar + safe area bawah
          paddingBottom: insets.bottom || 10, // Padding bawah untuk safe area atau default
          paddingTop: 8, // Padding atas
          borderRadius: 20,
          backgroundColor: tabBarBackgroundColor,
          borderTopWidth: 0, // Tidak ada border atas
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: darkMode ? 2 : 4 }, // Offset bayangan
          shadowOpacity: darkMode ? 0.2 : 0.1, // Opasitas bayangan
          shadowRadius: darkMode ? 6 : 10, // Radius bayangan
          elevation: 10, // Elevasi untuk Android
        },
        tabBarIcon: ({ focused: iconFocused }) => {
          // Ganti nama 'focused' agar tidak konflik dengan 'focused' dari screenOptions
          const IconComponent = iconMap[route.name];
          if (!IconComponent) return null; // Jika tidak ada ikon (misal untuk FAB)
          return (
            <IconComponent
              size={24}
              color={iconFocused ? iconColorActive : iconColorInactive}
              strokeWidth={iconFocused ? 2.5 : 2}
            />
          );
        },
      })}>
      {/* Tab Beranda, menggunakan HomeStackNavigator dan listener untuk reset ke HomeActual */}
      <Tab.Screen
        name="Beranda"
        component={HomeStackNavigator}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Beranda', { screen: 'HomeActual' });
          },
        })}
      />
      <Tab.Screen name="Cari" component={SearchScreen} />
      {/* Tab untuk FAB, menggunakan komponen kustom AnimatedFormButton */}
      <Tab.Screen
        name="Form" // Ini adalah nama rute tab yang akan dituju
        component={FormScreen} // FormScreen akan dirender sebagai konten dari tab ini
        options={({ navigation, route }) => ({
          tabBarLabel: '', // Tidak ada label teks di bawah FAB
          tabBarIcon: () => null, // Tidak ada ikon standar, karena kita pakai FAB kustom
          tabBarButton: (
            props // props ini dari React Navigation, berisi accessibilityState, onPress default, dll.
          ) => (
            <AnimatedFormButton
              {...props} // Penting untuk meneruskan props ini agar FAB berperilaku sebagai tombol tab
              darkMode={darkMode}
              // Aksi FAB: Navigasi ke tab "Form" itu sendiri
              // props.onPress() juga bisa digunakan di sini, atau navigation.navigate(route.name)
              onPress={() => navigation.navigate(route.name)}
            />
          ),
        })}
      />
      <Tab.Screen name="Riwayat" component={HistoryScreen} />
      <Tab.Screen name="Akun" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// StyleSheet untuk FAB (sesuai permintaan user)
const styles = StyleSheet.create({
  fabWrapper: { position: 'absolute', top: -35, alignSelf: 'center', zIndex: 10 },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    /* backgroundColor diatur inline */ alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 10,
  },
});

export default BottomNav;
