import React, { useRef } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import FormScreen from './screens/FormScreen';
import NotificationScreen from './screens/NotificationScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function AnimatedFormButton({ onPress }) {
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
    onPress?.();
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.fabContainer, { transform: [{ scale }] }]}>
        <View style={styles.fabButton}>
          <Ionicons name="document-text-outline" size={26} color="#fff" />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

function MyTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        tabBarStyle: {
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 6,
          borderTopWidth: 0.5,
          borderTopColor: '#e5e7eb',
          backgroundColor: '#ffffff',
          position: 'absolute',
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: any;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Notification':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              return null;
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#1d4ed8',     // biru tua elegan
        tabBarInactiveTintColor: '#9ca3af',   // abu soft
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Form"
        component={FormScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: (props) => <AnimatedFormButton {...props} />,
        }}
      />
      <Tab.Screen name="Notification" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    top: -28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
});
