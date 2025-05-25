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
  ScrollView,
} from 'react-native';
import { useNavigationState } from '@react-navigation/native'; // Hook untuk mendapatkan state navigasi
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

// Konstanta untuk dimensi dan animasi sidebar
const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_TARGET_WIDTH = SCREEN_WIDTH * 0.78; // Lebar sidebar saat terbuka
const darkModeYellowAccent = '#FACC15'; // Warna aksen kuning untuk dark mode

/**
 * Komponen Sidebar menampilkan menu navigasi samping.
 * Fitur: animasi buka/tutup (melebar), dark mode, menu aktif berdasarkan layar saat ini.
 *
 * @param {object} navigation - Objek navigasi dari React Navigation.
 * @param {function} onClose - Fungsi callback untuk menutup sidebar.
 * @param {boolean} darkMode - Status mode gelap saat ini.
 */
export default function Sidebar({ navigation, onClose, darkMode }) {
  // Animated value untuk animasi lebar sidebar
  const widthAnim = useRef(new Animated.Value(0)).current;
  // State untuk mengontrol submenu yang terbuka (berdasarkan label submenu)
  const [openSubmenus, setOpenSubmenus] = useState({});

  // Definisi warna dinamis berdasarkan darkMode
  const bgColor = darkMode ? '#1f2937' : '#ffffff'; // Latar belakang sidebar
  const textColor = darkMode ? '#e5e7eb' : '#374151'; // Warna teks default
  const activeColor = darkMode ? darkModeYellowAccent : '#2563eb'; // Warna teks/ikon untuk item aktif
  const profileNameColor = darkMode ? '#f9fafb' : '#111827'; // Warna nama profil
  const profileEmailColor = darkMode ? '#9ca3af' : '#6b7280'; // Warna email profil
  const iconDefaultColor = darkMode ? '#9ca3af' : '#6b7280'; // Warna ikon default
  const submenuBgColor = darkMode ? '#273343' : '#f9fafb'; // Latar belakang area submenu
  const borderSubmenuColor = darkMode ? '#4b5563' : '#d1d5db'; // Warna garis kiri submenu
  const activeItemBackground = darkMode ? '#3A331C' : '#eef2ff'; // Latar belakang item aktif

  // Mendapatkan state navigasi saat ini untuk menentukan menu aktif
  const navState = useNavigationState((state) => state);

  /**
   * Fungsi untuk mendapatkan "kunci" unik dari rute yang sedang aktif.
   * Kunci ini digunakan untuk membandingkan dengan ID item menu.
   * Format kunci: "NamaTab/NamaScreenDiDalamTab" atau "NamaScreenDiRoot".
   */
  const getActiveScreenKey = () => {
    if (!navState) return null;
    try {
      let currentRoute = navState.routes[navState.index]; // Rute saat ini di RootStack
      if (currentRoute.name === 'MainTabs' && currentRoute.state) {
        // Jika di dalam MainTabs (BottomNav)
        const tabNavState = currentRoute.state;
        const activeTabRoute = tabNavState.routes[tabNavState.index];
        if (activeTabRoute.name === 'Beranda' && activeTabRoute.state) {
          // Jika di dalam tab Beranda (HomeStackNavigator)
          const homeStackState = activeTabRoute.state;
          const activeScreenInHomeStack = homeStackState.routes[homeStackState.index];
          return `Beranda/${activeScreenInHomeStack.name}`;
        }
        return activeTabRoute.name; // Untuk tab lain seperti 'Cari', 'Notifikasi'
      }
      return currentRoute.name; // Untuk screen di RootStack (jika ada)
    } catch (error) {
      console.error('Error Sidebar getActiveScreenKey:', error);
      return null;
    }
  };
  const activeScreenKeyValue = getActiveScreenKey();

  // useEffect untuk animasi membuka sidebar (pelebaran)
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: SIDEBAR_TARGET_WIDTH,
      duration: 300,
      useNativeDriver: false, // Animasi 'width' tidak didukung native driver
    }).start();
  }, [widthAnim]);

  // Fungsi untuk menutup sidebar dengan animasi
  const handleClose = () => {
    Animated.timing(widthAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(onClose); // Panggil props.onClose setelah animasi selesai
  };

  // Fungsi untuk membuka/menutup submenu
  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Fungsi yang dijalankan ketika item menu ditekan
  const handleItemPress = (item) => {
    if (item.navigateToNested && item.targetTab && item.screen) {
      // Navigasi ke screen di dalam nested navigator (misal, screen di HomeStackNavigator)
      navigation.navigate('MainTabs', { screen: item.targetTab, params: { screen: item.screen } });
      handleClose();
    } else if (item.screen && item.params && !item.navigateToNested) {
      // Navigasi ke screen dengan params (misal, ke tab tertentu dan screen awal di dalamnya)
      navigation.navigate(item.screen, item.params);
      handleClose();
    } else if (item.submenu) {
      // Jika item adalah parent submenu, toggle buka/tutup submenu
      toggleSubmenu(item.label);
    } else if (item.label === 'Keluar') {
      // Logika untuk logout
      console.log('[Sidebar] Logout clicked');
      handleClose();
    } else if (item.screen) {
      // Fallback jika hanya ada screen tanpa params atau flag nested
      navigation.navigate(item.screen);
      handleClose();
    }
  };

  // Definisi item-item menu sidebar
  // 'id' digunakan untuk mencocokkan dengan activeScreenKeyValue untuk highlight menu aktif
  const menuItems = [
    {
      id: 'Beranda/HomeActual',
      label: 'Beranda',
      icon: Home,
      screen: 'MainTabs',
      params: { screen: 'Beranda', params: { screen: 'HomeActual' } },
    },
    {
      label: 'Formulir',
      icon: FileText,
      submenu: [
        {
          id: 'Beranda/FormulirA',
          label: 'Formulir A',
          screen: 'FormulirA',
          targetTab: 'Beranda',
          navigateToNested: true,
        },
        {
          id: 'Beranda/FormulirB',
          label: 'Formulir B',
          screen: 'FormulirB',
          targetTab: 'Beranda',
          navigateToNested: true,
        },
        {
          id: 'Beranda/FormulirC',
          label: 'Formulir C',
          screen: 'FormulirC',
          targetTab: 'Beranda',
          navigateToNested: true,
        },
      ],
    },
    {
      id: 'Beranda/KelolaPengguna',
      label: 'Kelola Pengguna',
      icon: Users,
      screen: 'KelolaPengguna',
      targetTab: 'Beranda',
      navigateToNested: true,
    },
    {
      id: 'Beranda/KelolaMenu',
      label: 'Kelola Menu',
      icon: LayoutGrid,
      screen: 'KelolaMenu',
      targetTab: 'Beranda',
      navigateToNested: true,
    },
    {
      id: 'Beranda/KelolaFormulir',
      label: 'Kelola Formulir',
      icon: ClipboardList,
      screen: 'KelolaFormulir',
      targetTab: 'Beranda',
      navigateToNested: true,
    },
    {
      id: 'Beranda/Pengaturan',
      label: 'Pengaturan',
      icon: Settings,
      screen: 'Pengaturan',
      targetTab: 'Beranda',
      navigateToNested: true,
    },
    { id: 'Logout', label: 'Keluar', icon: LogOut, color: '#ef4444' }, // Item logout
  ];

  // Fungsi untuk merender setiap item menu (dan submenu)
  const renderMenuItem = (item, isSubItem = false) => {
    const IconComponent = item.icon;
    // Tentukan apakah item ini aktif berdasarkan perbandingan ID dengan activeScreenKeyValue
    let itemIsActive = item.id
      ? activeScreenKeyValue === item.id
      : item.submenu
        ? item.submenu.some((sub) => sub.id && activeScreenKeyValue === sub.id)
        : false;

    const itemTextColorToUse = itemIsActive ? activeColor : item.color || textColor;
    const itemIconColorToUse = itemIsActive ? activeColor : item.color || iconDefaultColor; // Prioritaskan item.color jika ada, lalu warna aktif, lalu default
    const itemBgColorToUse = itemIsActive && !item.submenu ? activeItemBackground : 'transparent';

    return (
      <TouchableOpacity
        key={item.label}
        style={[
          styles.menuItem,
          isSubItem && styles.submenuItem,
          { backgroundColor: itemBgColorToUse },
        ]}
        onPress={() => handleItemPress(item)}>
        {IconComponent && <IconComponent size={22} color={itemIconColorToUse} />}
        <Text
          style={[
            styles.menuText,
            {
              color: itemTextColorToUse,
              fontFamily: itemIsActive ? 'Poppins-SemiBold' : 'Poppins-Regular',
            },
            isSubItem && !IconComponent && { marginLeft: 36 }, // Indentasi untuk subitem tanpa ikon
          ]}>
          {item.label}
        </Text>
        {/* Tampilkan ikon chevron jika item memiliki submenu dan bukan subitem */}
        {item.submenu &&
          !isSubItem &&
          (openSubmenus[item.label] ? (
            <ChevronUp size={18} color={iconDefaultColor} style={styles.chevron} />
          ) : (
            <ChevronDown size={18} color={iconDefaultColor} style={styles.chevron} />
          ))}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.overlay}>
      {/* Backdrop untuk menutup sidebar saat diklik */}
      <Pressable style={styles.backdrop} onPress={handleClose} />
      {/* Kontainer sidebar yang dianimasikan lebarnya */}
      <Animated.View
        style={[
          styles.sidebar,
          { width: widthAnim, overflow: 'hidden', backgroundColor: bgColor },
        ]}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={profileNameColor} />
        </TouchableOpacity>

        {/* Informasi profil pengguna */}
        <View style={styles.profile}>
          <UserCircle size={34} color={iconDefaultColor} />
          <View>
            <Text style={[styles.name, { color: profileNameColor }]}>Rangga</Text>
            <Text style={[styles.email, { color: profileEmailColor }]}>rangga@gmail.com</Text>
          </View>
        </View>

        {/* Daftar menu item */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.menu}>
            {menuItems.map((item) => (
              <View key={item.label}>
                {renderMenuItem(item)}
                {/* Render submenu jika item memiliki submenu dan sedang terbuka */}
                {item.submenu && openSubmenus[item.label] && (
                  <Animated.View
                    style={[
                      styles.submenuContainer,
                      { backgroundColor: submenuBgColor, borderLeftColor: borderSubmenuColor },
                    ]}>
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
  overlay: { ...StyleSheet.absoluteFillObject, flexDirection: 'row', zIndex: 999 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
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
    top: Platform.OS === 'android' ? 42 : 45,
    right: 10,
    padding: 5,
    zIndex: 10,
  }, // Tombol close di kanan atas sidebar
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: Platform.OS === 'android' ? 35 : 15,
    paddingLeft: 5,
    gap: 12,
  },
  name: { fontSize: 15, fontFamily: 'Poppins-SemiBold' },
  email: { fontSize: 12, fontFamily: 'Poppins-Regular' },
  menu: { gap: 3 }, // Jarak antar item menu utama
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 12,
  },
  menuText: { fontSize: 14, fontFamily: 'Poppins-Regular', flexShrink: 1 }, // flexShrink agar teks tidak keluar jika panjang
  submenuContainer: {
    marginLeft: 10,
    paddingLeft: 8,
    borderLeftWidth: 2,
    marginTop: 3,
    marginBottom: 3,
    borderRadius: 4,
  }, // Kontainer untuk submenu
  submenuItem: { paddingVertical: 8 }, // Style spesifik untuk subitem
  chevron: { marginLeft: 'auto' }, // Posisi ikon chevron di paling kanan
});
