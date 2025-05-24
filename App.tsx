// App.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
// import './global.css'; // Hanya jika Anda menargetkan web juga dan menggunakan ini

// Komponen
import BottomNav from './components/BottomNav';
import NavbarWithSidebar from './components/NavbarWithSidebar';

// Screen komponen (jika ada screen di RootStack selain MainTabs, misal Login)
// Untuk kasus ini, sebagian besar screen ada di dalam HomeStackNavigator

const RootStack = createNativeStackNavigator();

// Komponen untuk layout utama yang berisi Navbar dan Tab Navigator (BottomNav)
function MainTabsLayout({ navigation }) {
  return (
    <View style={styles.container}>
      <NavbarWithSidebar navigation={navigation} />
      <BottomNav />
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (fontError) {
    console.error("Font loading error: ", fontError);
    // Anda bisa menampilkan pesan error di sini
    return (
        <View style={styles.loadingContainer}>
            <Text>Gagal memuat font.</Text>
        </View>
    );
  }


  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="MainTabs" component={MainTabsLayout} />
          {/* Jika ada screen lain di root (misal Login), tambahkan di sini */}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#FFF' : undefined, // Latar belakang default untuk web
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});