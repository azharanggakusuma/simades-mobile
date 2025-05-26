import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
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
  Alert,
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
  Briefcase,
} from 'lucide-react-native';

// Konstanta
const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_TARGET_WIDTH = SCREEN_WIDTH * 0.78;
const darkModeYellowAccent = '#FACC15';

// Data Pengguna Statis
const sidebarUser = {
  name: 'Azharangga K.',
  detailInfo: 'Administrator',
};

// Definisi item-item menu sidebar (sumber)
const menuItemsSource = [
    { id: 'Beranda/HomeActual', label: 'Beranda', icon: Home, screen: 'MainTabs', params: { screen: 'Beranda', params: { screen: 'HomeActual' } }},
    { label: 'Formulir', icon: FileText,
      submenu: [
        { id: 'Beranda/FormulirA', label: 'Formulir A', screen: 'FormulirA', targetTab: 'Beranda', navigateToNested: true },
        { id: 'Beranda/FormulirB', label: 'Formulir B', screen: 'FormulirB', targetTab: 'Beranda', navigateToNested: true },
        { id: 'Beranda/FormulirC', label: 'Formulir C', screen: 'FormulirC', targetTab: 'Beranda', navigateToNested: true },
      ]},
    { id: 'Beranda/KelolaPengguna', label: 'Kelola Pengguna', icon: Users, screen: 'KelolaPengguna', targetTab: 'Beranda', navigateToNested: true },
    { id: 'Beranda/KelolaMenu', label: 'Kelola Menu', icon: LayoutGrid, screen: 'KelolaMenu', targetTab: 'Beranda', navigateToNested: true },
    { id: 'Beranda/KelolaFormulir', label: 'Kelola Formulir', icon: ClipboardList, screen: 'KelolaFormulir', targetTab: 'Beranda', navigateToNested: true },
    { id: 'Beranda/Pengaturan', label: 'Pengaturan', icon: Settings, screen: 'Pengaturan', targetTab: 'Beranda', navigateToNested: true },
];

// --- Interface untuk MenuItemComponent ---
interface MenuItemComponentProps {
  item: any;
  isSubItem?: boolean;
  isActive: boolean;
  isOpen?: boolean;
  onItemPress: (item: any) => void;
  textColor: string;
  activeColor: string;
  iconDefaultColor: string;
  isLastItem?: boolean; // Untuk submenu, jika ini adalah item terakhir
  separatorColor?: string; // Untuk separator di atas logout
}

// --- Komponen MenuItem yang di-memoize ---
const MenuItemComponent: React.FC<MenuItemComponentProps> = React.memo(({
  item,
  isSubItem = false,
  isActive,
  isOpen,
  onItemPress,
  textColor,
  activeColor,
  iconDefaultColor,
  separatorColor,
}) => {
  const IconComponent = item.icon;
  const currentItemTextColor = item.color ? item.color : (isActive ? activeColor : textColor);
  const currentItemIconColor = item.color ? item.color : (isActive ? activeColor : iconDefaultColor);
  const currentFontFamily = isActive || item.id === 'Logout' ? 'Poppins-SemiBold' : 'Poppins-Regular';

  return (
    <View>
      {item.id === 'Logout' && separatorColor && <View style={[styles.separatorAboveLogout, {backgroundColor: separatorColor}]} />}
      <TouchableOpacity
        style={[
          styles.menuItem,
          isSubItem && styles.submenuItem,
        ]}
        onPress={() => onItemPress(item)}
        activeOpacity={0.65}
      >
        {isActive && !item.submenu && item.id !== 'Logout' && (
          <View style={[styles.activeItemIndicator, { backgroundColor: activeColor }]} />
        )}
        <View style={styles.menuItemContent}>
          {IconComponent && (
          <View style={styles.iconWrapper}>
            <IconComponent
                size={isSubItem ? 18 : 20}
                color={currentItemIconColor}
                strokeWidth={isActive || item.id === 'Logout' ? 2.2 : 1.8}
            />
          </View>
          )}
          <Text
            style={[
                styles.menuText,
                { color: currentItemTextColor, fontFamily: currentFontFamily },
                isSubItem && styles.submenuItemText,
                !IconComponent && isSubItem && { // Jika submenu item tidak ada ikon
                  marginLeft: (styles.iconWrapper?.width || 20) + (styles.iconWrapper?.marginRight || 14) // Sesuaikan dengan style iconWrapper
                },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.label}
          </Text>
        </View>
        {item.submenu && !isSubItem && (
          isOpen ?
          <ChevronUp size={18} color={iconDefaultColor} style={styles.chevronIcon} /> :
          <ChevronDown size={18} color={iconDefaultColor} style={styles.chevronIcon} />
        )}
      </TouchableOpacity>
    </View>
  );
});


export default function Sidebar({ navigation, onClose, darkMode }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const [openSubmenus, setOpenSubmenus] = useState({});

  const bgColor = darkMode ? '#1A202C' : '#FFFFFF';
  const textColor = darkMode ? '#CBD5E1' : '#4B5563';
  const activeColor = darkMode ? darkModeYellowAccent : '#2563EB';
  const profileNameColor = darkMode ? '#F9FAFC' : '#111827';
  const profileDetailColor = darkMode ? '#9CA3AF' : '#6B7280';
  const iconDefaultColor = darkMode ? '#9CA3AF' : '#6B7280';
  const submenuBorderColor = darkMode ? '#4B5563' : '#E5E7EB';
  const separatorColor = darkMode ? '#374151' : '#E5E7EB';
  const logoutItemSpecificColor = darkMode ? '#FFA7A7' : '#E53E3E';

  const menuItems = useMemo(() => [
    ...menuItemsSource,
    { id: 'Logout', label: 'Keluar', icon: LogOut, color: logoutItemSpecificColor }
  ], [logoutItemSpecificColor]);

  const navState = useNavigationState((state) => state);

  const activeScreenKeyValue = useMemo(() => {
    if (!navState) return null;
    try {
      let currentRoute = navState.routes[navState.index];
      // ... (sisa logika getActiveScreenKey Anda, tidak perlu diubah)
      if (currentRoute.name === 'MainTabs' && currentRoute.state) {
        const tabNavState = currentRoute.state;
        const activeTabRoute = tabNavState.routes[tabNavState.index];
        if (activeTabRoute.name === 'Beranda' && activeTabRoute.state) {
          const homeStackState = activeTabRoute.state;
          const activeScreenInHomeStack = homeStackState.routes[homeStackState.index];
          return `Beranda/${activeScreenInHomeStack.name}`;
        }
        return activeTabRoute.name; // Ini mungkin salah, jika MainTabs punya tab lain selain Beranda yang bukan stack
                                     // Sebaiknya id item menu disesuaikan dengan route name yang sebenarnya
                                     // atau item.id nya adalah route name langsung dari screen
      }
      return currentRoute.name;
    } catch (error) {
      console.error('Error Sidebar getActiveScreenKey:', error);
      return null;
    }
  }, [navState]);


  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: SIDEBAR_TARGET_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [widthAnim]); // widthAnim adalah Animated.Value, referensinya stabil, jadi ini hanya jalan sekali

  const handleClose = useCallback(() => {
    Animated.timing(widthAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(onClose); // onClose adalah prop, jika bisa berubah, tambahkan ke dependency array
  }, [widthAnim, onClose]);

  const toggleSubmenu = useCallback((label) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []); // Tidak ada dependensi eksternal, aman

  const handleItemPress = useCallback((item) => {
    if (item.id === 'Logout') {
        Alert.alert(
            'Keluar Akun',
            'Apakah Anda yakin ingin keluar dari sesi ini?',
            [
              { text: 'Batal', style: 'cancel' },
              {
                text: 'Keluar',
                style: 'destructive',
                onPress: () => {
                  console.log('[Sidebar] Pengguna memilih keluar.');
                  // Implementasi logika keluar
                  handleClose();
                },
              },
            ],
            { cancelable: true }
          );
    } else if (item.submenu) {
      toggleSubmenu(item.label);
    } else if (item.navigateToNested && item.targetTab && item.screen) {
      navigation.navigate('MainTabs', { screen: item.targetTab, params: { screen: item.screen, params: item.params } });
      handleClose();
    } else if (item.screen) { // Disederhanakan, params bisa undefined
      navigation.navigate(item.screen, item.params);
      handleClose();
    }
  }, [navigation, handleClose, toggleSubmenu]);


  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <Animated.View
        style={[
          styles.sidebar,
          { width: widthAnim, backgroundColor: bgColor },
        ]}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={profileDetailColor} />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <UserCircle size={48} color={activeColor} strokeWidth={1.5}/>
          </View>
          <View style={styles.profileTextWrapper}>
            <Text style={[styles.profileName, { color: profileNameColor }]}>{sidebarUser.name}</Text>
            <View style={styles.profileRoleWrapper}>
              <Briefcase size={14} color={profileDetailColor} strokeWidth={1.8} />
              <Text style={[styles.profileRoleOrEmail, { color: profileDetailColor }]}>{sidebarUser.detailInfo}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.mainSeparator, {backgroundColor: separatorColor}]} />

        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuScrollContainer}
        >
          {menuItems.map((item) => {
            // Kalkulasi isActive di sini sebelum meneruskan ke MenuItemComponent
            const isActive = item.id
              ? activeScreenKeyValue === item.id
              : item.submenu
              ? item.submenu.some((sub) => sub.id && activeScreenKeyValue === sub.id)
              : false;

            return (
              <View key={item.id || item.label}>
                <MenuItemComponent
                  item={item}
                  isActive={isActive}
                  isOpen={item.submenu ? openSubmenus[item.label] : undefined}
                  onItemPress={handleItemPress}
                  textColor={textColor}
                  activeColor={activeColor}
                  iconDefaultColor={iconDefaultColor}
                  separatorColor={item.id === 'Logout' ? separatorColor : undefined}
                />
                {item.submenu && openSubmenus[item.label] && (
                  <View
                    style={[
                      styles.submenuContainer,
                      { borderLeftColor: submenuBorderColor },
                    ]}>
                    {item.submenu.map((subItem) => {
                      const isSubActive = subItem.id && activeScreenKeyValue === subItem.id;
                      return (
                        <MenuItemComponent
                          key={subItem.id || subItem.label}
                          item={subItem}
                          isSubItem={true}
                          isActive={isSubActive}
                          onItemPress={handleItemPress}
                          textColor={textColor}
                          activeColor={activeColor}
                          iconDefaultColor={iconDefaultColor}
                        />
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, flexDirection: 'row', zIndex: 1000 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    paddingTop: Platform.OS === 'android' ? 30 : (Dimensions.get('window').height > 800 ? 55 : 45),
    paddingBottom: 20,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.20,
    shadowRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 43 : (Dimensions.get('window').height > 800 ? 50 : 40),
    right: 15,
    padding: 10,
    zIndex: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: Platform.OS === 'android' ? 25 : 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(150,150,150,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileTextWrapper: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 1,
  },
  profileRoleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileRoleOrEmail: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginLeft: 5,
  },
  mainSeparator: {
    marginHorizontal: 20,
    marginBottom: 10,
    height: StyleSheet.hairlineWidth,
  },
  separatorAboveLogout: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 0, // Untuk komponen MenuItem, ini mungkin perlu disesuaikan agar full-width relatif terhadap item
    marginTop: 10,
    marginBottom: 0, // Dihilangkan karena MenuItem punya paddingVertical
  },
  menuScrollContainer: {
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10, // Padding horizontal untuk item
    borderRadius: 8,
    marginBottom: 2,
    position: 'relative',
  },
  activeItemIndicator: {
    position: 'absolute',
    left: -15, // Relatif terhadap paddingHorizontal ScrollView
    top: '20%',
    bottom: '20%',
    width: 4,
    borderRadius: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 22, // Lebar area ikon
    marginRight: 14, // Jarak ikon ke teks
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    flex: 1, // Agar teks bisa menggunakan sisa ruang
  },
  submenuContainer: {
    marginLeft: 22, // (iconWrapper.width) - sesuaikan dengan kebutuhan indentasi
    paddingLeft: 12, // Padding internal submenu
    borderLeftWidth: 1.5,
    marginTop: 1,
    marginBottom: 3,
  },
  submenuItem: { // Override untuk submenu item
    paddingVertical: 9,
    paddingHorizontal: 0, // Padding horizontal sudah diatur oleh submenuContainer dan indentasi
    marginBottom: 0,
  },
  submenuItemText: {
    fontSize: 13.5,
  },
  chevronIcon: { marginLeft: 'auto' }, // Dorong chevron ke kanan
});