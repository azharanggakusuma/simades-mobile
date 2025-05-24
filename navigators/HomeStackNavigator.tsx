// navigators/HomeStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import semua screen yang akan di-handle oleh stack ini
import HomeScreen from '../screens/HomeScreen';
import FormulirA from '../screens/FormulirA';
import FormulirB from '../screens/FormulirB';
import FormulirC from '../screens/FormulirC';
import KelolaPengguna from '../screens/KelolaPengguna';
import KelolaMenu from '../screens/KelolaMenu';
import KelolaFormulir from '../screens/KelolaFormulir';
import Pengaturan from '../screens/Pengaturan';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeActual" component={HomeScreen} />
      <Stack.Screen name="FormulirA" component={FormulirA} />
      <Stack.Screen name="FormulirB" component={FormulirB} />
      <Stack.Screen name="FormulirC" component={FormulirC} />
      <Stack.Screen name="KelolaPengguna" component={KelolaPengguna} />
      <Stack.Screen name="KelolaMenu" component={KelolaMenu} />
      <Stack.Screen name="KelolaFormulir" component={KelolaFormulir} />
      <Stack.Screen name="Pengaturan" component={Pengaturan} />
    </Stack.Navigator>
  );
}