import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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

export default function Sidebar({ navigation, onClose }) {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [activeMenu, setActiveMenu] = useState('Beranda');
  const [openSubmenus, setOpenSubmenus] = useState([]);

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

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleItemPress = (item) => {
    if (item.screen) {
      setActiveMenu(item.label);
      navigation.navigate(item.screen);
      handleClose();
    } else if (item.submenu) {
      toggleSubmenu(item.label);
    } else if (item.label === 'Keluar') {
      console.log('Logout clicked');
    }
  };

  const menuItems = [
    // Untuk item "Beranda", navigasi ke screen "MainTabs" dan spesifikasikan tab "Beranda"
    {
      label: 'Beranda',
      icon: <Home size={22} />,
      screen: 'MainTabs',
      params: { screen: 'Beranda' },
    },
    {
      label: 'Formulir',
      icon: <FileText size={22} />,
      submenu: [
        // Ini akan navigasi ke screen penuh FormulirA, B, C di RootStack
        { label: 'Formulir A', screen: 'FormulirA' },
        { label: 'Formulir B', screen: 'FormulirB' },
        { label: 'Formulir C', screen: 'FormulirC' },
      ],
    },
    // Item berikut akan navigasi ke screen penuh masing-masing di RootStack
    { label: 'Kelola Pengguna', icon: <Users size={22} />, screen: 'KelolaPengguna' },
    { label: 'Kelola Menu', icon: <LayoutGrid size={22} />, screen: 'KelolaMenu' },
    { label: 'Kelola Formulir', icon: <ClipboardList size={22} />, screen: 'KelolaFormulir' },
    { label: 'Pengaturan', icon: <Settings size={22} />, screen: 'Pengaturan' },
    { label: 'Keluar', icon: <LogOut size={22} />, color: '#ef4444' }, // Tambahkan logika logout di sini
  ];

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.profile}>
          <UserCircle size={34} color="#4B5563" style={styles.avatar} />
          <View>
            <Text style={styles.name}>Rangga</Text>
            <Text style={styles.email}>rangga@gmail.com</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item) => {
            const isOpen = openSubmenus.includes(item.label);
            return (
              <View key={item.label}>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleItemPress(item)}>
                  {item.icon}
                  <Text
                    style={[
                      styles.menuText,
                      {
                        color: activeMenu === item.label ? '#2563eb' : item.color || '#374151',
                        fontFamily: activeMenu === item.label ? 'Poppins-Bold' : 'Poppins-Regular',
                      },
                    ]}>
                    {item.label}
                  </Text>
                  {item.submenu &&
                    (isOpen ? (
                      <ChevronUp size={18} color="#6b7280" style={{ marginLeft: 'auto' }} />
                    ) : (
                      <ChevronDown size={18} color="#6b7280" style={{ marginLeft: 'auto' }} />
                    ))}
                </TouchableOpacity>

                {item.submenu && isOpen && (
                  <View style={styles.submenu}>
                    {item.submenu.map((sub) => (
                      <TouchableOpacity
                        key={sub.label}
                        style={[
                          styles.menuItem,
                          styles.submenuItem,
                          activeMenu === sub.label && styles.activeItem,
                        ]}
                        onPress={() => {
                          setActiveMenu(sub.label);
                          navigation.navigate(sub.screen);
                          handleClose();
                        }}>
                        <Text
                          style={{
                            marginLeft: 28,
                            fontSize: 14,
                            fontFamily:
                              activeMenu === sub.label ? 'Poppins-Bold' : 'Poppins-Regular',
                            color: activeMenu === sub.label ? '#2563eb' : '#374151',
                          }}>
                          {sub.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </Animated.View>
    </View>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
  },
  email: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
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
    fontSize: 14,
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
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
  },
});
