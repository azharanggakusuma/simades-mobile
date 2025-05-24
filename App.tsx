// App.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import './global.css';

// Komponen
import BottomNav from './components/BottomNav';
import NavbarWithSidebar from './components/NavbarWithSidebar';

// Screens asli dari folder screens/
import HomeScreen from './screens/HomeScreen';
import FormulirA from './screens/FormulirA';
import FormulirB from './screens/FormulirB';
import FormulirC from './screens/FormulirC';
import KelolaPengguna from './screens/KelolaPengguna';
import KelolaMenu from './screens/KelolaMenu';
import KelolaFormulir from './screens/KelolaFormulir';
import Pengaturan from './screens/Pengaturan';

const Stack = createNativeStackNavigator();

function MainLayout({ navigation }) {
  return (
    <>
      <NavbarWithSidebar navigation={navigation} />
      <BottomNav />
    </>
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainLayout} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="FormulirA" component={FormulirA} />
          <Stack.Screen name="FormulirB" component={FormulirB} />
          <Stack.Screen name="FormulirC" component={FormulirC} />
          <Stack.Screen name="KelolaPengguna" component={KelolaPengguna} />
          <Stack.Screen name="KelolaMenu" component={KelolaMenu} />
          <Stack.Screen name="KelolaFormulir" component={KelolaFormulir} />
          <Stack.Screen name="Pengaturan" component={Pengaturan} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
