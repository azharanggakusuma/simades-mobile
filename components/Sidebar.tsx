// components/Sidebar.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView
} from 'react-native';
import {
  X,
  UserCircle,
  Home,
  FileText,
  ChevronDown,
  ChevronUp,
  Users,
  LayoutGrid,
  ClipboardList,
  Settings,
  LogOut,
} from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Sidebar({ navigation, onClose, darkMode }) {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [activeMenu, setActiveMenu] = useState('Beranda');
  const [openSubmenus, setOpenSubmenus] = useState({}); // Gunakan objek untuk submenu

  const bgColor = darkMode ? '#1f2937' : '#ffffff';
  const textColor = darkMode ? '#e5e7eb' : '#374151';
  const activeColor = darkMode ? '#60a5fa' : '#2563eb'; // Biru lebih terang untuk dark mode
  const profileNameColor = darkMode ? '#f9fafb' : '#111827';
  const profileEmailColor = darkMode ? '#9ca3af' : '#6b7280';
  const iconDefaultColor = darkMode ? '#9ca3af' : '#6b7280';
  const submenuBgColor = darkMode ? '#273343' : '#f9fafb'; // Sedikit beda untuk submenu

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true, // Lebih baik untuk performa di native
    }).start();
  }, [slideAnim]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleItemPress = (item) => {
    console.log('[Sidebar] Item pressed:', JSON.stringify(item, null, 2));
    setActiveMenu(item.label);

    if (item.navigateToNested && item.targetTab && item.screen) {
      console.log('[Sidebar] Attempting NESTED navigation to MainTabs ->', item.targetTab, '->', item.screen);
      navigation.navigate('MainTabs', {
        screen: item.targetTab,
        params: {
          screen: item.screen,
        },
      });
      handleClose();
    } else if (item.screen && item.params && typeof item.navigateToNested === 'undefined') {
      console.log('[Sidebar] Attempting TAB/PARAMS navigation to:', item.screen, 'with params:', JSON.stringify(item.params));
      navigation.navigate(item.screen, item.params);
      handleClose();
    } else if (item.submenu) {
      console.log('[Sidebar] Toggling submenu for:', item.label);
      toggleSubmenu(item.label);
    } else if (item.label === 'Keluar') {
      console.log('[Sidebar] Logout clicked');
      // Implementasi logout
      handleClose();
    } else {
      console.warn('[Sidebar] No specific navigation action taken for item:', JSON.stringify(item, null, 2));
      // Jika ada item screen tanpa params dan bukan nested, mungkin perlu ditangani di sini
      if (item.screen) {
          console.log('[Sidebar] Attempting DIRECT navigation (review if intended):', item.screen);
          // navigation.navigate(item.screen); // Hati-hati dengan ini, bisa menyebabkan error "not handled"
          handleClose();
      }
    }
  };

  const menuItems = [
    {
      label: 'Beranda',
      icon: Home,
      screen: 'MainTabs',
      params: { screen: 'Beranda', params: { screen: 'HomeActual' } },
    },
    {
      label: 'Formulir',
      icon: FileText,
      submenu: [
        { label: 'Formulir A', screen: 'FormulirA', targetTab: 'Beranda', navigateToNested: true },
        { label: 'Formulir B', screen: 'FormulirB', targetTab: 'Beranda', navigateToNested: true },
        { label: 'Formulir C', screen: 'FormulirC', targetTab: 'Beranda', navigateToNested: true },
      ],
    },
    { label: 'Kelola Pengguna', icon: Users, screen: 'KelolaPengguna', targetTab: 'Beranda', navigateToNested: true },
    { label: 'Kelola Menu', icon: LayoutGrid, screen: 'KelolaMenu', targetTab: 'Beranda', navigateToNested: true },
    { label: 'Kelola Formulir', icon: ClipboardList, screen: 'KelolaFormulir', targetTab: 'Beranda', navigateToNested: true },
    { label: 'Pengaturan', icon: Settings, screen: 'Pengaturan', targetTab: 'Beranda', navigateToNested: true },
    { label: 'Keluar', icon: LogOut, color: '#ef4444' },
  ];

  const renderMenuItem = (item, isSubItem = false) => {
    const IconComponent = item.icon;
    const isActive = activeMenu === item.label;
    const itemTextColor = isActive ? activeColor : (item.color || textColor);
    const itemIconColor = isActive ? activeColor : (item.color || iconDefaultColor);

    return (
      <TouchableOpacity
        key={item.label}
        style={[
          styles.menuItem,
          isSubItem ? styles.submenuItem : {},
          isActive && !item.submenu && (isSubItem ? styles.activeSubItem : styles.activeItem),
          { backgroundColor: isActive && !item.submenu ? (darkMode ? '#2c3e50' : '#eef2ff') : 'transparent' }
        ]}
        onPress={() => handleItemPress(item)}
      >
        {IconComponent && <IconComponent size={22} color={itemIconColor} />}
        <Text style={[styles.menuText, { color: itemTextColor, fontFamily: isActive ? 'Poppins-SemiBold' : 'Poppins-Regular' }, isSubItem && { marginLeft: IconComponent ? 0 : 22 + 14}]}>
          {item.label}
        </Text>
        {item.submenu && !isSubItem && (
          openSubmenus[item.label] ?
          <ChevronUp size={18} color={iconDefaultColor} style={{ marginLeft: 'auto' }} /> :
          <ChevronDown size={18} color={iconDefaultColor} style={{ marginLeft: 'auto' }} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }], backgroundColor: bgColor }]}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={profileNameColor} />
        </TouchableOpacity>

        <View style={styles.profile}>
          <UserCircle size={34} color={iconDefaultColor} />
          <View>
            <Text style={[styles.name, {color: profileNameColor}]}>Rangga</Text>
            <Text style={[styles.email, {color: profileEmailColor}]}>rangga@gmail.com</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.menu}>
            {menuItems.map((item) => (
                <View key={item.label}>
                {renderMenuItem(item)}
                {item.submenu && openSubmenus[item.label] && (
                    <Animated.View style={[styles.submenuContainer, {backgroundColor: submenuBgColor}]}>
                    {item.submenu.map((sub) => renderMenuItem(sub, true))}
                    </Animated.View>
                )}
                </View>
            ))}
            </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Lebih gelap sedikit
  },
  sidebar: {
    width: SCREEN_WIDTH * 0.78,
    height: '100%',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 50, // Disesuaikan
    elevation: 8, // Untuk Android
    shadowColor: '#000', // Untuk iOS
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 25 : 50, // Disesuaikan
    right: 15,
    padding: 5,
    zIndex: 10,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: Platform.OS === 'android' ? 30 : 10, // Jarak dari atas setelah tombol close
    paddingLeft: 5, // Sedikit padding
    gap: 12,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  email: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  menu: {
    gap: 5, // Jarak antar item utama
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 14,
  },
  activeItem: {
    // backgroundColor: '#eef2ff', // Dikelola inline untuk dark mode
  },
  activeSubItem: {
    // backgroundColor: '#f0f9ff', // Dikelola inline untuk dark mode
  },
  menuText: {
    fontSize: 14,
    flexShrink: 1, // Agar teks tidak terpotong jika panjang
  },
  submenuContainer: {
    marginLeft: 15, // Indentasi submenu
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#d1d5db', // Garis pemisah submenu (sesuaikan untuk dark mode)
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 6,
  },
  submenuItem: {
    paddingVertical: 8,
    // gap lebih kecil untuk submenu
  },
});