import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function NavbarWithSidebar({ navigation }) {
  const insets = useSafeAreaInsets();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleMenuPress = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);
  const handleToggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <>
      <Navbar
        insets={insets}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isSidebarOpen={isSidebarOpen}
        onMenuPress={handleMenuPress}
      />
      {isSidebarOpen && (
        <Sidebar navigation={navigation} onClose={handleCloseSidebar} />
      )}
    </>
  );
}
