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
  const fabBackgroundColor = darkMode ? darkModeYellowAccent : '#3b82f6';
  const iconColorInFab = darkMode ? '#1F2937' : '#FFFFFF';

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start();
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
  const insets = useSafeAreaInsets();
  const iconMap = { Beranda: Home, Cari: Search, Riwayat: Clock, Akun: User };

  const tabBarBackgroundColor = darkMode ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255,255,255,0.98)'; // Sedikit lebih solid
  const labelColorInactive = darkMode ? '#9CA3AF' : '#6B7280';
  const labelColorActive = darkMode ? darkModeYellowAccent : '#3b82f6';
  const iconColorInactive = darkMode ? '#9CA3AF' : '#9ca3af';
  const iconColorActive = darkMode ? darkModeYellowAccent : '#3b82f6';
  // Warna border atas untuk tab bar yang tidak mengambang
  const topBorderColor = darkMode ? '#374151' : '#E5E7EB'; // Tailwind gray-700 / gray-200

  return (
    <Tab.Navigator
      screenOptions={({ route, focused }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: Platform.OS === 'ios' ? (insets.bottom > 0 ? 0 : 2) : 5, // Sesuaikan margin jika ada safe area
          fontFamily: focused ? 'Poppins-SemiBold' : 'Poppins-Regular',
          color: focused ? labelColorActive : labelColorInactive,
        },
        tabBarStyle: {
          // --- PERUBAHAN STYLE UNTUK TAB BAR TIDAK MENGAMBANG ---
          // Hapus position: 'absolute', left, right, bottom (untuk margin mengambang), borderRadius
          // Hapus shadow properties dan elevation jika tidak ingin ada efek bayangan sama sekali
          
          // position: 'absolute', // DIHAPUS
          // bottom: 8, // DIHAPUS
          // left: 16, // DIHAPUS
          // right: 16, // DIHAPUS
          // borderRadius: 20, // DIHAPUS

          height: 56 + insets.bottom, // Tinggi tab bar standar + safe area bawah
          paddingBottom: insets.bottom, // Padding bawah hanya untuk safe area
          paddingTop: 8,
          backgroundColor: tabBarBackgroundColor,
          borderTopWidth: StyleSheet.hairlineWidth, // Garis tipis di atas tab bar
          borderTopColor: topBorderColor, 

          // Jika masih ingin sedikit shadow (opsional, untuk desain yang lebih flat bisa dihilangkan)
          // shadowColor: darkMode ? '#050505' : '#000000',
          // shadowOffset: { width: 0, height: -2 }, // Shadow ke atas
          // shadowOpacity: darkMode ? 0.15 : 0.05,
          // shadowRadius: darkMode ? 4 : 6,
          // elevation: 5, // Elevasi minimal jika shadow diinginkan
        },
        tabBarIcon: ({ focused: iconFocused }) => {
          const IconComponent = iconMap[route.name];
          if (!IconComponent) return null;
          return (
            <IconComponent
              size={24}
              color={iconFocused ? iconColorActive : iconColorInactive}
              strokeWidth={iconFocused ? 2.5 : 2}
            />
          );
        },
      })}>
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
      <Tab.Screen
        name="Form"
        component={FormScreen}
        options={({ navigation, route }) => ({
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <AnimatedFormButton
              {...props}
              darkMode={darkMode}
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

// StyleSheet untuk FAB
const styles = StyleSheet.create({
  fabWrapper: { 
    position: 'absolute', 
    // Sesuaikan 'top' agar FAB pas di atas tab bar yang baru
    // Jika tinggi tab bar sekitar 56px, maka -28 akan menempatkan FAB di tengah atas
    // Atau -25 agar sedikit lebih naik
    top: -28, // Sebelumnya -35, disesuaikan karena tab bar tidak lagi ada margin bawah yg besar
    alignSelf: 'center', 
    zIndex: 10 
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 10, // Biarkan elevasi FAB tetap ada
  },
});

export default BottomNav;