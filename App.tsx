import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native'; 
import { NavigationContainer, useNavigation } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import './global.css';

// Komponen
import BottomNav from './components/BottomNav';
import NavbarWithSidebar from './components/NavbarWithSidebar';

// Screens 
import HomeScreen from './screens/HomeScreen'; // Digunakan oleh BottomNav
import FormulirA from './screens/FormulirA';
import FormulirB from './screens/FormulirB';
import FormulirC from './screens/FormulirC';
import KelolaPengguna from './screens/KelolaPengguna';
import KelolaMenu from './screens/KelolaMenu';
import KelolaFormulir from './screens/KelolaFormulir';
import Pengaturan from './screens/Pengaturan';
// Screen lain yang mungkin digunakan oleh BottomNav juga perlu dipertimbangkan jika akan dinavigasi dari luar
// import SearchScreen from './screens/SearchScreen';
// import FormScreen from './screens/FormScreen';
// import NotificationScreen from './screens/NotificationScreen';
// import ProfileScreen from './screens/ProfileScreen';

const RootStack = createNativeStackNavigator();

// Komponen baru untuk layout utama yang berisi Navbar dan Tab Navigator (BottomNav)
function MainTabsLayout({ navigation }) {
  // 'navigation' di sini adalah navigation prop dari RootStack.Navigator
  // Ini akan diteruskan ke NavbarWithSidebar untuk navigasi tingkat atas.
  return (
    <View style={styles.container}>
      <NavbarWithSidebar navigation={navigation} />
      {/* BottomNav adalah Tab.Navigator yang akan merender screen-screen tabnya sendiri */}
      <BottomNav />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {/* Screen utama yang menampilkan layout dengan tab */}
          <RootStack.Screen name="MainTabs" component={MainTabsLayout} />
          {/* Ini adalah screen yang diakses dari Sidebar */}
          <RootStack.Screen name="HomeScreen" component={HomeScreen} />
          <RootStack.Screen name="FormulirA" component={FormulirA} />
          <RootStack.Screen name="FormulirB" component={FormulirB} />
          <RootStack.Screen name="FormulirC" component={FormulirC} />
          <RootStack.Screen name="KelolaPengguna" component={KelolaPengguna} />
          <RootStack.Screen name="KelolaMenu" component={KelolaMenu} />
          <RootStack.Screen name="KelolaFormulir" component={KelolaFormulir} />
          <RootStack.Screen name="Pengaturan" component={Pengaturan} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});