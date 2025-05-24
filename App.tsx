import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform, Text, StatusBar } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import './global.css'; // Import global CSS (jika digunakan, misal dengan NativeWind)

// Komponen aplikasi
import BottomNav from './components/BottomNav';
import NavbarWithSidebar from './components/NavbarWithSidebar';

// Navigator utama aplikasi
const RootStack = createNativeStackNavigator();

// Definisi warna tema kustom
const darkModeYellowAccent = '#FACC15';
const appDarkBackgroundColor = '#121212';
const appLightBackgroundColor = '#F3F4F6';

// Konfigurasi tema untuk React Navigation (Light Mode)
const MyDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3b82f6', // Warna aksen utama untuk light mode
    background: appLightBackgroundColor,
    card: '#FFFFFF',
    text: '#111827',
    border: '#E5E7EB',
  },
};

// Konfigurasi tema untuk React Navigation (Dark Mode)
const MyDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: darkModeYellowAccent, // Warna aksen utama untuk dark mode
    background: appDarkBackgroundColor,
    card: '#1f2937',
    text: '#E5E7EB',
    border: '#2D2D2D',
  },
};

/**
 * Komponen MainTabsLayout berfungsi sebagai wrapper untuk tata letak utama aplikasi
 * yang menyertakan NavbarWithSidebar dan BottomNav.
 * Menerima props darkMode dan handleToggleDarkMode untuk diteruskan ke child components.
 */
function MainTabsLayout({ navigation, darkMode, handleToggleDarkMode }) {
  return (
    <View
      style={[
        styles.appContainer,
        { backgroundColor: darkMode ? appDarkBackgroundColor : appLightBackgroundColor },
      ]}>
      <NavbarWithSidebar
        navigation={navigation}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      <BottomNav darkMode={darkMode} />
    </View>
  );
}

/**
 * Komponen App adalah root komponen aplikasi.
 * Mengelola state global seperti darkMode dan pemuatan font.
 */
export default function App() {
  // State dan error handling untuk pemuatan font kustom
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  // State untuk mengelola status dark mode aplikasi
  const [darkMode, setDarkMode] = useState(false); // Default: light mode
  const handleToggleDarkMode = useCallback(() => {
    setDarkMode((prevMode) => !prevMode);
  }, []);

  // useEffect untuk mengatur style StatusBar (ikon dan teks di status bar HP)
  // agar sesuai dengan tema aplikasi (dark/light)
  useEffect(() => {
    StatusBar.setBarStyle(darkMode ? 'light-content' : 'dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(
        darkMode ? appDarkBackgroundColor : appLightBackgroundColor,
        true
      );
    }
  }, [darkMode]);

  // Tampilan loading selama font belum termuat
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={darkMode ? darkModeYellowAccent : '#3b82f6'} />
      </View>
    );
  }

  // Tampilan error jika font gagal dimuat
  if (fontError) {
    console.error('Font loading error: ', fontError);
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Gagal memuat font.</Text>
        <Text style={styles.errorTextDetails}>{fontError.message}</Text>
      </View>
    );
  }

  // Pilih tema navigasi yang akan digunakan berdasarkan status darkMode
  const navThemeToUse = darkMode ? MyDarkTheme : MyDefaultTheme;

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navThemeToUse}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {/* Screen utama aplikasi, menggunakan render prop untuk meneruskan props tambahan */}
          <RootStack.Screen name="MainTabs">
            {(props) => (
              <MainTabsLayout
                {...props} // Props standar navigasi (navigation, route)
                darkMode={darkMode}
                handleToggleDarkMode={handleToggleDarkMode}
              />
            )}
          </RootStack.Screen>
          {/* Screen lain di root navigator bisa ditambahkan di sini jika ada (misal: Login, Detail, dll) */}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    // backgroundColor diatur secara dinamis berdasarkan darkMode di MainTabsLayout
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Warna latar default saat loading awal
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular', // Menggunakan font yang sudah didefinisikan
    marginBottom: 5,
  },
  errorTextDetails: {
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
