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
const darkModeYellowAccent = '#FACC15';

/**
 * Komponen AnimatedFormButton adalah tombol aksi mengambang (FAB) kustom
 * dengan animasi tekan yang lebih kaya.
 *
 * @param {function} onPress - Fungsi yang dipanggil saat FAB ditekan.
 * @param {boolean} darkMode - Status mode gelap untuk penyesuaian style FAB.
 */
const AnimatedFormButton = ({ onPress, darkMode }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current; // Untuk animasi naik/turun
  const opacity = useRef(new Animated.Value(1)).current;   // Untuk animasi opacity

  const fabBackgroundColor = darkMode ? darkModeYellowAccent : '#3b82f6';
  const iconColorInFab = darkMode ? '#1F2937' : '#FFFFFF';

  // Animasi saat FAB ditekan masuk
  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scale, { // Skala mengecil dengan cepat
        toValue: 0.92,
        duration: 100, // Durasi singkat untuk kesan responsif
        useNativeDriver: true,
      }),
      Animated.timing(translateY, { // Tombol sedikit turun
        toValue: 3, // Turun 3 piksel
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, { // Opacity sedikit berkurang
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animasi saat FAB dilepas
  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { // Skala kembali dengan efek pegas
        toValue: 1,
        friction: 4, // Sedikit lebih teredam dari sebelumnya
        tension: 70, // Kekuatan pegas
        useNativeDriver: true,
      }),
      Animated.spring(translateY, { // Tombol kembali ke posisi semula
        toValue: 0,
        friction: 4,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, { // Opacity kembali normal
        toValue: 1,
        duration: 150, // Sedikit lebih lama agar terasa halus
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onPress) onPress(); // Panggil aksi setelah animasi selesai
    });
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View 
        style={[
          styles.fabWrapper, 
          { 
            transform: [{ scale }, { translateY }], // Terapkan scale dan translateY
            opacity: opacity // Terapkan opacity
          }
        ]}
      >
        <View style={[styles.fabButton, { backgroundColor: fabBackgroundColor }]}>
          <ClipboardList size={26} color={iconColorInFab} />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// Komponen BottomNav tetap sama, hanya AnimatedFormButton yang berubah
const BottomNav = ({ darkMode }) => {
  const insets = useSafeAreaInsets();
  const iconMap = { Beranda: Home, Cari: Search, Riwayat: Clock, Akun: User };

  const tabBarBackgroundColor = darkMode ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255,255,255,0.98)';
  const labelColorInactive = darkMode ? '#9CA3AF' : '#6B7280';
  const labelColorActive = darkMode ? darkModeYellowAccent : '#3b82f6';
  const iconColorInactive = darkMode ? '#9CA3AF' : '#9ca3af';
  const iconColorActive = darkMode ? darkModeYellowAccent : '#3b82f6';
  const topBorderColor = darkMode ? '#374151' : '#E5E7EB';

  return (
    <Tab.Navigator
      screenOptions={({ route, focused }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: Platform.OS === 'ios' ? (insets.bottom > 0 ? 0 : 2) : 5,
          fontFamily: focused ? 'Poppins-SemiBold' : 'Poppins-Regular',
          color: focused ? labelColorActive : labelColorInactive,
        },
        tabBarStyle: {
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: tabBarBackgroundColor,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: topBorderColor, 
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
            <AnimatedFormButton // Menggunakan AnimatedFormButton yang sudah diimprove
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

// StyleSheet untuk FAB (posisi top mungkin perlu sedikit penyesuaian jika animasi Y mengubah persepsi)
const styles = StyleSheet.create({
  fabWrapper: { 
    position: 'absolute', 
    top: -28, 
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
    elevation: 10,
  },
});

export default BottomNav;