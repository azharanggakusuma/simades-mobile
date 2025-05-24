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
import { useNavigationState } from '@react-navigation/native';
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
const SIDEBAR_TARGET_WIDTH = SCREEN_WIDTH * 0.78;

export default function Sidebar({ navigation, onClose, darkMode }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  // Hapus useState activeMenu, karena akan digantikan oleh logika dari navigation state
  // const [activeMenu, setActiveMenu] = useState('Beranda');
  const [openSubmenus, setOpenSubmenus] = useState({});

  // Warna-warna
  const bgColor = darkMode ? '#1f2937' : '#ffffff';
  const textColor = darkMode ? '#e5e7eb' : '#374151';
  const activeColor = darkMode ? '#60a5fa' : '#2563eb';
  const profileNameColor = darkMode ? '#f9fafb' : '#111827';
  const profileEmailColor = darkMode ? '#9ca3af' : '#6b7280';
  const iconDefaultColor = darkMode ? '#9ca3af' : '#6b7280';
  const submenuBgColor = darkMode ? '#273343' : '#f9fafb';
  const borderSubmenuColor = darkMode ? '#4b5563' : '#d1d5db';
  const activeItemBackground = darkMode ? '#2c3e50' : '#eef2ff';


  // Dapatkan state navigasi saat ini
  const navState = useNavigationState(state => state);

  const getActiveScreenKey = () => {
    if (!navState) return null;

    try {
      let currentRoute = navState.routes[navState.index]; // Route di RootStack

      if (currentRoute.name === 'MainTabs' && currentRoute.state) {
        // Jika kita berada di dalam MainTabs (yang komponennya adalah MainTabsLayout -> BottomNav)
        const tabNavState = currentRoute.state; // State dari BottomNav
        const activeTabRoute = tabNavState.routes[tabNavState.index]; 

        if (activeTabRoute.name === 'Beranda' && activeTabRoute.state) {
          // Jika tab aktif adalah 'Beranda' (yang komponennya adalah HomeStackNavigator)
          const homeStackState = activeTabRoute.state; // State dari HomeStackNavigator
          const activeScreenInHomeStack = homeStackState.routes[homeStackState.index];
          return `Beranda/${activeScreenInHomeStack.name}`; 
        }
        // Jika tab aktif lain (Cari, Notifikasi, Akun) dan mereka bukan stack,
        // atau jika ingin menandai tab itu sendiri sebagai aktif.
        return activeTabRoute.name; 
      }
      // Jika kita berada di screen lain di RootStack (misal, jika ada layar Login)
      return currentRoute.name;
    } catch (error) {
      console.error("Error getting active screen key:", error, navState);
      return null; 
    }
  };

  const activeScreenKeyValue = getActiveScreenKey();
  // console.log("Active Screen Key:", activeScreenKeyValue);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: SIDEBAR_TARGET_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [widthAnim]);

  const handleClose = () => {
    Animated.timing(widthAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => onClose());
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleItemPress = (item) => {
    // Hapus setActiveMenu(item.label) karena status aktif akan dari navState
    // console.log('[Sidebar] Item pressed:', JSON.stringify(item, null, 2));

    if (item.navigateToNested && item.targetTab && item.screen) {
      navigation.navigate('MainTabs', { screen: item.targetTab, params: { screen: item.screen } });
      handleClose();
    } else if (item.screen && item.params && typeof item.navigateToNested === 'undefined') {
      navigation.navigate(item.screen, item.params);
      handleClose();
    } else if (item.submenu) {
      toggleSubmenu(item.label);
    } else if (item.label === 'Keluar') {
      console.log('[Sidebar] Logout clicked');
      handleClose();
    } else {
      if (item.screen) {
        handleClose();
      }
    }
  };

  const menuItems = [
    { id: 'Beranda/HomeActual', label: 'Beranda', icon: Home, screen: 'MainTabs', params: { screen: 'Beranda', params: { screen: 'HomeActual' } } },
    { label: 'Formulir', icon: FileText, submenu: [
        { id: 'Beranda/FormulirA', label: 'Formulir A', screen: 'FormulirA', targetTab: 'Beranda', navigateToNested: true },
        { id: 'Beranda/FormulirB', label: 'Formulir B', screen: 'FormulirB', targetTab: 'Beranda', navigateToNested: true },
        { id: 'Beranda/FormulirC', label: 'Formulir C', screen: 'FormulirC', targetTab: 'Beranda', navigateToNested: true },
    ]},
    { id: 'Beranda/KelolaPengguna', label: 'Kelola Pengguna', icon: Users, screen: 'KelolaPengguna', targetTab: 'Beranda', navigateToNested: true },
    { id: 'Beranda/KelolaMenu', label: 'Kelola Menu', icon: LayoutGrid, screen: 'KelolaMenu', targetTab: 'Beranda', navigateToNested: true },
    { id: 'Beranda/KelolaFormulir', label: 'Kelola Formulir', icon: ClipboardList, screen: 'KelolaFormulir', targetTab: 'Beranda', navigateToNested: true },
    { id: 'Beranda/Pengaturan', label: 'Pengaturan', icon: Settings, screen: 'Pengaturan', targetTab: 'Beranda', navigateToNested: true },
    { id: 'Logout', label: 'Keluar', icon: LogOut, color: '#ef4444' },
  ];

  const renderMenuItem = (item, isSubItem = false) => {
    const IconComponent = item.icon;
    let itemIsActive = false;

    if (item.id) {
      itemIsActive = activeScreenKeyValue === item.id;
    } else if (item.submenu) {
      // Parent submenu aktif jika salah satu anaknya aktif
      itemIsActive = item.submenu.some(sub => sub.id && activeScreenKeyValue === sub.id);
    }

    const itemTextColor = itemIsActive ? activeColor : (item.color || textColor);
    const itemIconColor = itemIsActive ? activeColor : (item.color || (item.color ? item.color : iconDefaultColor));
    const itemBgColor = itemIsActive && !item.submenu ? activeItemBackground : 'transparent';

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
        <Text style={[
            styles.menuText,
            { color: itemTextColor, fontFamily: itemIsActive ? 'Poppins-SemiBold' : 'Poppins-Regular' },
            isSubItem && !IconComponent && { marginLeft: (22 + 14) }
        ]}>
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
      <Animated.View style={[
        styles.sidebar,
        {
          width: widthAnim,
          overflow: 'hidden',
          backgroundColor: bgColor
        }
      ]}>
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
    flexDirection: 'row',
    zIndex: 999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 50,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 45 : 45, 
    right: 10,
    padding: 5,
    zIndex: 10,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, 
    marginTop: Platform.OS === 'android' ? 35 : 15,
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
    gap: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular', 
    flexShrink: 1,
  },
  submenuContainer: {
    marginLeft: 10, 
    paddingLeft: 8, 
    borderLeftWidth: 2,
    marginTop: 3, 
    marginBottom: 3,
    borderRadius: 4,
  },
  submenuItem: {
    paddingVertical: 8, 
  },
});