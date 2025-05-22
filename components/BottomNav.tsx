import React, { useRef } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FormScreen from '../screens/FormScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';

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
    }).start();
    if (onPress) onPress();
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.fabWrapper, { transform: [{ scale }] }]}>
        <View style={styles.fabButton}>
          <Ionicons name="file-tray-full-outline" size={28} color="#fff" />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const BottomNav = () => {
  const insets = useSafeAreaInsets();

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
        tabBarStyle: {
          position: 'absolute',
          bottom: 8,
          left: 16,
          right: 16,
          height: 70 + insets.bottom,
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
        tabBarIcon: ({ focused, color }) => {
          const iconMap = {
            Beranda: 'home',
            Cari: 'search',
            Notifikasi: 'notifications',
            Akun: 'person',
          };

          const iconName = focused
            ? iconMap[route.name]
            : `${iconMap[route.name]}-outline`;

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Cari" component={SearchScreen} />
      <Tab.Screen
        name="Form"
        component={FormScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: (props) => <AnimatedFormButton {...props} />,
        }}
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
