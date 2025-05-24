// components/Layout.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavbarWithSidebar from './NavbarWithSidebar';
import BottomNav from './BottomNav';

const Layout = ({ children, navigation }) => {
  return (
    <View style={styles.container}>
      <NavbarWithSidebar navigation={navigation} />
      <View style={styles.content}>
        {children}
      </View>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default Layout;
