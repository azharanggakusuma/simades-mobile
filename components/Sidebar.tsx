import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Sidebar({ onClose }) {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Beranda');

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        {/* Close Button */}
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#111827" />
        </TouchableOpacity>

        {/* Profile */}
        <View style={styles.profile}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/1' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>Rangga</Text>
            <Text style={styles.email}>rangga@gmail.com</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          <SidebarItem
            icon="home-outline"
            label="Beranda"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />

          <TouchableOpacity style={styles.menuItem} onPress={() => setIsFormOpen(!isFormOpen)}>
            <Ionicons name="file-tray-full-outline" size={22} color="#374151" />
            <Text style={styles.menuText}>Form</Text>
            <Ionicons
              name={isFormOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#6b7280"
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>

          {isFormOpen && (
            <View style={styles.submenu}>
              <SidebarItem
                label="Form A"
                isSub
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
              />
              <SidebarItem
                label="Form B"
                isSub
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
              />
              <SidebarItem
                label="Form C"
                isSub
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
              />
            </View>
          )}

          <SidebarItem
            icon="people-outline"
            label="Manage Users"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
          <SidebarItem
            icon="grid-outline"
            label="Manage Menu"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
          <SidebarItem
            icon="document-text-outline"
            label="Manage Form"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
          <SidebarItem
            icon="settings-outline"
            label="Pengaturan"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
          <SidebarItem
            icon="log-out-outline"
            label="Keluar"
            color="#ef4444"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
        </View>
      </Animated.View>
    </View>
  );
}

function SidebarItem({ icon, label, color = '#374151', isSub = false, activeMenu, setActiveMenu }) {
  const isActive = activeMenu === label;
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isSub && styles.submenuItem,
        isActive && styles.activeItem,
      ]}
      onPress={() => setActiveMenu(label)}
    >
      {icon && <Ionicons name={icon} size={22} color={isActive ? '#2563eb' : color} />}
      <Text
        style={[
          styles.menuText,
          {
            color: isActive ? '#2563eb' : color,
            marginLeft: icon ? 0 : 28,
            fontWeight: isActive ? '700' : '500',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 999,
    width: '100%',
    height: '100%',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SCREEN_WIDTH * 0.78,
    height: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 50,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 14,
    zIndex: 10,
    padding: 6,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  email: {
    fontSize: 13,
    color: '#6b7280',
  },
  menu: {
    gap: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 6,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  submenu: {
    marginLeft: 4,
    marginTop: 4,
    gap: 8,
  },
  submenuItem: {
    paddingLeft: 15,
  },
  activeItem: {
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});
