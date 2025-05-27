import React, { useRef } from 'react';
import { View, Animated, StyleSheet, TouchableWithoutFeedback, Platform, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, User, Clock, ClipboardList } from 'lucide-react-native';

// Import screen (sesuaikan path jika perlu)
import SearchScreen from '../screens/SearchScreen';
import FormScreen from '../screens/FormScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeStackNavigator from '../navigation/HomeStackNavigator';

const Tab = createBottomTabNavigator();

// --- PALET WARNA DAN TEMA ---
const COLORS = {
  primaryLight: '#007AFF',
  primaryDark: '#F59E0B',
  //primaryLight: '#3b82f6',
  //primaryDark: '#FACC15',
  white: '#FFFFFF',
  black: '#000000',
  greyUltraLight: '#F3F4F6',
  greyLight: '#D1D5DB',
  greyMedium: '#6B7280',
  greyDark: '#1F2937',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#111827',
  fabIconLight: '#FFFFFF',
  fabIconDark: '#1F2937',
  activePillLight: 'rgba(37, 99, 235, 0.12)',
  activePillDark: 'rgba(245, 158, 11, 0.2)',
};

const AppTheme = (darkMode) => ({
  tabBarBackground: darkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
  labelInactive: COLORS.greyMedium,
  labelActive: darkMode ? COLORS.primaryDark : COLORS.primaryLight,
  iconInactive: COLORS.greyMedium,
  iconActive: darkMode ? COLORS.primaryDark : COLORS.primaryLight,
  topBorder: darkMode ? COLORS.greyDark : COLORS.greyLight, // Untuk border atas tab bar
  fabBackground: darkMode ? COLORS.primaryDark : COLORS.primaryLight,
  fabIcon: darkMode ? COLORS.fabIconDark : COLORS.fabIconLight,
  activePillBackground: darkMode ? COLORS.activePillDark : COLORS.activePillLight,
});

// --- KONSTANTA STYLING ---
// Tinggi dasar tab bar, sudah termasuk padding internal untuk konten, belum termasuk safeAreaInsets.bottom.
const BASE_TAB_BAR_HEIGHT_WITH_INTERNAL_PADDING = 70;
const FAB_SIZE = 60;
// Padding tambahan di bawah konten (ikon & label) sebelum safe area.
// Total padding bawah = PADDING_BOTTOM_FOR_CONTENT + insets.bottom.
const PADDING_BOTTOM_FOR_CONTENT = Platform.OS === 'ios' ? 12 : 14;
const PADDING_TOP_FOR_CONTENT = 10;


// --- KOMPONEN FAB ANIMASI ---
const AnimatedFormButton = ({ onPress, darkMode }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const theme = AppTheme(darkMode);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, friction: 7 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 70 }).start();
  };

  const animatedStyle = { transform: [{ scale }] };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.fabWrapper, animatedStyle]}>
        <View style={[styles.fabButton, { backgroundColor: theme.fabBackground }]}>
          <ClipboardList size={FAB_SIZE * 0.45} color={theme.fabIcon} strokeWidth={2.3} />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// --- KOMPONEN UTAMA BOTTOM NAV ---
const BottomNav = ({ darkMode }) => {
  const insets = useSafeAreaInsets();
  const theme = AppTheme(darkMode);
  const iconMap = { Beranda: Home, Cari: Search, Riwayat: Clock, Akun: User };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: BASE_TAB_BAR_HEIGHT_WITH_INTERNAL_PADDING + insets.bottom,
          backgroundColor: theme.tabBarBackground,
          borderTopWidth: StyleSheet.hairlineWidth, // Garis tipis pemisah di atas tab bar
          borderTopColor: theme.topBorder,
          paddingTop: PADDING_TOP_FOR_CONTENT,
          // paddingBottom ini mendorong konten ke atas dari tepi bawah (termasuk safe area)
          paddingBottom: insets.bottom + PADDING_BOTTOM_FOR_CONTENT,
          elevation: 0, // Hapus shadow default Android
          shadowOpacity: 0, // Hapus shadow default iOS
        },
        tabBarItemStyle: {
          justifyContent: 'flex-start', // Konten item mulai dari atas (setelah paddingTop tabBarStyle)
        },
        tabBarIcon: ({ focused }) => {
          const IconComponent = iconMap[route.name];
          if (!IconComponent) return null;
          return (
            <View style={[
              styles.iconWrapper,
              focused && { backgroundColor: theme.activePillBackground }
            ]}>
              <IconComponent
                size={focused ? 25 : 23}
                color={focused ? theme.iconActive : theme.iconInactive}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          );
        },
        tabBarLabel: ({ focused, children }) => (
          <Text style={{
            fontSize: 10.5,
            fontFamily: focused ? 'Poppins-SemiBold' : 'Poppins-Regular',
            color: focused ? theme.labelActive : theme.labelInactive,
            marginTop: 5, // Jarak dari ikon ke label
            textAlign: 'center',
          }}>
            {children}
          </Text>
        ),
      })}
    >
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
        options={({ navigation }) => ({
          tabBarButton: () => (
            <AnimatedFormButton
              darkMode={darkMode}
              onPress={() => navigation.navigate("Form")}
            />
          ),
          tabBarLabel: () => null,
          tabBarIcon: () => null,
        })}
      />
      <Tab.Screen name="Riwayat" component={HistoryScreen} />
      <Tab.Screen name="Akun" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    // `top` memposisikan FAB relatif terhadap 'slot' tabBarButton-nya.
    // Nilai negatif akan mengangkat FAB ke atas.
    // (FAB_SIZE * 0.55) membuat sekitar 55% FAB berada di atas titik nol slotnya.
    // Sesuaikan nilai ini jika perlu untuk mencapai overlap visual yang diinginkan.
    top: -(FAB_SIZE * 0.55),
    // zIndex: 10, // Aktifkan jika FAB tertutup elemen lain, umumnya tidak perlu jika FAB adalah tabBarButton
  },
  fabButton: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow untuk FAB
    shadowColor: COLORS.black,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 7,
    elevation: 8,
  },
  iconWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomNav;