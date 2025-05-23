import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

import NavbarWithSidebar from './components/NavbarWithSidebar';
import Beranda from './screens/HomeScreen';
import FormulirA from './screens/FormulirA';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainLayout} />
          <Stack.Screen name="FormulirA" component={FormulirA} />
          {/* Tambahkan FormulirB, FormulirC, dll bila perlu */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Menampilkan Navbar + screen utama
function MainLayout({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <NavbarWithSidebar navigation={navigation} />
      <Beranda />
    </View>
  );
}
