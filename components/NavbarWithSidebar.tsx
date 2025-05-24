import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Komponen NavbarWithSidebar adalah wrapper yang menggabungkan Navbar (atas)
 * dan Sidebar (menu samping). Komponen ini mengelola status buka/tutup Sidebar.
 *
 * @param {object} navigation - Objek navigasi dari React Navigation.
 * @param {boolean} darkMode - Status mode gelap, diterima dari parent (App.tsx).
 * @param {function} onToggleDarkMode - Fungsi untuk mengubah status mode gelap, diterima dari parent.
 */
export default function NavbarWithSidebar({ navigation, darkMode, onToggleDarkMode }) {
  // Mendapatkan nilai insets untuk safe area (misalnya, untuk status bar atau notch)
  const insets = useSafeAreaInsets();
  // State untuk mengontrol visibilitas Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fungsi untuk membuka/menutup Sidebar
  const handleMenuPress = () => setIsSidebarOpen(!isSidebarOpen);
  // Fungsi untuk menutup Sidebar (biasanya dipanggil dari dalam Sidebar)
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <Navbar
        insets={insets}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        isSidebarOpen={isSidebarOpen}
        onMenuPress={handleMenuPress}
      />
      {/* Sidebar hanya dirender jika isSidebarOpen bernilai true */}
      {isSidebarOpen && (
        <Sidebar navigation={navigation} onClose={handleCloseSidebar} darkMode={darkMode} />
      )}
    </>
  );
}
