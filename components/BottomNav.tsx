import React, { useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Text
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Icons
import {
  Home,
  Search,
  User,
  Clock,
  ClipboardList,
} from 'lucide-react-native';

// Screens
import SearchScreen from '../screens/SearchScreen';
import FormScreen from '../screens/FormScreen'; // Untuk FAB
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';

import HomeStackNavigator from '../navigators/HomeStackNavigator';

const Tab = createBottomTabNavigator();

const AnimatedFormButton = ({ onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      if (onPress) onPress();
    });
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.fabWrapper, { transform: [{ scale }] }]}>
        <View style={styles.fabButton}>
          <ClipboardList size={26} color="#fff" />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const BottomNav = () => {
  const insets = useSafeAreaInsets();

  const iconMap = {
    Beranda: Home,
    Cari: Search,
    Notifikasi: Clock,
    Akun: User,
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { 
          fontSize: 12,
          marginBottom: 2,
          fontWeight: '600',
          fontFamily: 'Poppins-Regular',
        },
        tabBarStyle: { // Style asli Anda
          position: 'absolute',
          bottom: 8,
          left: 16,
          right: 16,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom || 10,
          paddingTop: 8,
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarIcon: ({ focused }) => {
          const IconComponent = iconMap[route.name];
          if (!IconComponent) return null;
          return (
            <IconComponent
              size={24}
              color={focused ? '#3b82f6' : '#9ca3af'}
              strokeWidth={focused ? 2.5 : 2}
            />
          );
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
      })}
    >
      <Tab.Screen
        name="Beranda"
        component={HomeStackNavigator}
        listeners={({ navigation, route }) => ({
          // Event ini akan dijalankan setiap kali tab "Beranda" ditekan
          tabPress: (e) => {
            // Mencegah aksi default navigasi tab standar
            e.preventDefault();

            // Secara eksplisit navigasi ke rute 'Beranda' (tab itu sendiri),
            // dan di dalamnya, navigasi ke screen 'HomeActual' (layar awal di HomeStackNavigator)
            navigation.navigate('Beranda', { screen: 'HomeActual' });
          },
        })}
      />
      <Tab.Screen name="Cari" component={SearchScreen} />
      <Tab.Screen
        name="AddForm"
        component={FormScreen}
        options={({ navigation }) => ({
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <AnimatedFormButton
              {...props}
              onPress={() => {
                navigation.navigate('Beranda', { screen: 'FormulirA' });
              }}
            />
          ),
        })}
      />
      <Tab.Screen name="Notifikasi" component={NotificationScreen} />
      <Tab.Screen name="Akun" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    top: -35,
    alignSelf: 'center',
    zIndex: 10,
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
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