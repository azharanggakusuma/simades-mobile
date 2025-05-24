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
const SIDEBAR_TARGET_WIDTH = SCREEN_WIDTH * 0.78; // Lebar target sidebar

export default function Sidebar({ navigation, onClose, darkMode }) {
  // Mengganti slideAnim dengan widthAnim
  const widthAnim = useRef(new Animated.Value(0)).current; // Mulai dengan lebar 0
  const [activeMenu, setActiveMenu] = useState('Beranda');
  const [openSubmenus, setOpenSubmenus] = useState({});

  const bgColor = darkMode ? '#1f2937' : '#ffffff';
  const textColor = darkMode ? '#e5e7eb' : '#374151';
  const activeColor = darkMode ? '#60a5fa' : '#2563eb';
  const profileNameColor = darkMode ? '#f9fafb' : '#111827';
  const profileEmailColor = darkMode ? '#9ca3af' : '#6b7280';
  const iconDefaultColor = darkMode ? '#9ca3af' : '#6b7280';
  const submenuBgColor = darkMode ? '#273343' : '#f9fafb';
  const borderSubmenuColor = darkMode ? '#4b5563' : '#d1d5db';


  useEffect(() => {
    // Animasikan lebar saat sidebar muncul
    Animated.timing(widthAnim, {
      toValue: SIDEBAR_TARGET_WIDTH, // Animasikan ke lebar target
      duration: 300,
      useNativeDriver: false, // Animasi 'width' tidak didukung native driver
    }).start();
  }, [widthAnim]);

  const handleClose = () => {
    // Animasikan lebar saat sidebar ditutup
    Animated.timing(widthAnim, {
      toValue: 0, // Animasikan kembali ke lebar 0
      duration: 200,
      useNativeDriver: false, // Animasi 'width' tidak didukung native driver
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
      handleClose();
    } else {
      console.warn('[Sidebar] No specific navigation action taken for item:', JSON.stringify(item, null, 2));
      if (item.screen) {
          console.log('[Sidebar] Attempting DIRECT navigation (review if intended):', item.screen);
          handleClose();
      }
    }
  };

  const menuItems = [
    { label: 'Beranda', icon: Home, screen: 'MainTabs', params: { screen: 'Beranda', params: { screen: 'HomeActual' } } },
    { label: 'Formulir', icon: FileText, submenu: [
        { label: 'Formulir A', screen: 'FormulirA', targetTab: 'Beranda', navigateToNested: true },
        { label: 'Formulir B', screen: 'FormulirB', targetTab: 'Beranda', navigateToNested: true },
        { label: 'Formulir C', screen: 'FormulirC', targetTab: 'Beranda', navigateToNested: true },
    ]},
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
    const itemBgColor = isActive && !item.submenu ? (darkMode ? '#2c3e50' : '#eef2ff') : 'transparent';

    return (
      <TouchableOpacity
        key={item.label}
        style={[
          styles.menuItem,
          isSubItem ? styles.submenuItem : {},
          { backgroundColor: itemBgColor }
        ]}
        onPress={() => handleItemPress(item)}
      >
        {IconComponent && <IconComponent size={22} color={itemIconColor} />}
        <Text style={[styles.menuText, { color: itemTextColor, fontFamily: isActive ? 'Poppins-SemiBold' : 'Poppins-Regular' }, isSubItem && { marginLeft: IconComponent ? 0 : (22 + 14) /* Jika tidak ada ikon, beri margin pengganti */ }]}>
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
      {/* Menggunakan widthAnim untuk style width dan tambahkan overflow: 'hidden' */}
      <Animated.View style={[
        styles.sidebar, // Style dasar sidebar (tanpa width eksplisit)
        {
          width: widthAnim, // Lebar dianimasikan
          overflow: 'hidden', // Konten terpotong jika melebihi lebar
          backgroundColor: bgColor
        }
      ]}>
        {/* Untuk memastikan konten tidak langsung muncul sebelum animasi lebar selesai,
            kita bisa tambahkan View dengan opacity yang dianimasikan, atau
            tunda render konten jika widthAnim masih sangat kecil.
            Namun, overflow: 'hidden' biasanya sudah cukup untuk visual.
        */}
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
                    <Animated.View style={[styles.submenuContainer, {backgroundColor: submenuBgColor, borderLeftColor: borderSubmenuColor}]}>
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
    flexDirection: 'row', // Penting agar backdrop dan sidebar berdampingan
    zIndex: 999,
  },
  backdrop: {
    flex: 1, // Mengisi sisa ruang jika sidebar tidak full width
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sidebar: { // Hapus properti 'width' dari sini
    position: 'absolute', // Atau bisa juga tidak absolut jika overlay flexDirection: 'row'
    left: 0, // Pastikan menempel di kiri
    top: 0,
    height: '100%',
    // backgroundColor: diatur inline oleh darkMode
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 50,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 }, // Shadow ke arah kanan
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 25 : 50,
    right: 15,
    padding: 5,
    zIndex: 10, // Di atas konten lain di sidebar
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: Platform.OS === 'android' ? 30 : 10,
    paddingLeft: 5,
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
    gap: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 14,
  },
  // backgroundColor untuk activeItem/activeSubItem diatur inline
  menuText: {
    fontSize: 14,
    flexShrink: 1,
  },
  submenuContainer: {
    marginLeft: 15,
    paddingLeft: 10,
    borderLeftWidth: 2,
    // borderLeftColor: diatur inline oleh darkMode
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 6,
  },
  submenuItem: {
    paddingVertical: 8,
  },
});