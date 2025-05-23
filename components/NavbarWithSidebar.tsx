import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  Pressable,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Menu,
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
  Moon,
  Sun,
} from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function NavbarWithSidebar({ navigation }) {
  const insets = useSafeAreaInsets();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleMenuPress = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <View style={[navStyles.container, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={handleMenuPress}>
          {isSidebarOpen ? <X size={28} color="#1f2937" /> : <Menu size={28} color="#1f2937" />}
        </TouchableOpacity>

        <Text style={navStyles.title}>SIMADES</Text>

        <TouchableOpacity onPress={() => setDarkMode(!darkMode)} style={navStyles.iconButton}>
          {darkMode ? <Sun size={24} color="#1f2937" /> : <Moon size={24} color="#1f2937" />}
        </TouchableOpacity>
      </View>

      {isSidebarOpen && <Sidebar onClose={handleCloseSidebar} navigation={navigation} />}
    </>
  );
}

function Sidebar({ onClose, navigation }) {
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
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const menuItems = [
    { label: 'Beranda', icon: <Home size={22} />, screen: 'Main' },
    {
      label: 'Formulir',
      icon: <FileText size={22} />,
      submenu: [
        { label: 'Formulir A', screen: 'FormulirA' },
        { label: 'Formulir B', screen: 'FormulirB' },
        { label: 'Formulir C', screen: 'FormulirC' },
      ],
    },
    { label: 'Kelola Pengguna', icon: <Users size={22} /> },
    { label: 'Kelola Menu', icon: <LayoutGrid size={22} /> },
    { label: 'Kelola Formulir', icon: <ClipboardList size={22} /> },
    { label: 'Pengaturan', icon: <Settings size={22} /> },
    { label: 'Keluar', icon: <LogOut size={22} />, color: '#ef4444' },
  ];

  return (
    <View style={sideStyles.overlay}>
      <Pressable style={sideStyles.backdrop} onPress={handleClose} />
      <Animated.View style={[sideStyles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity onPress={handleClose} style={sideStyles.closeButton}>
          <X size={24} color="#111827" />
        </TouchableOpacity>

        <View style={sideStyles.profile}>
          <Image source={{ uri: 'https://i.pravatar.cc/1' }} style={sideStyles.avatar} />
          <View>
            <Text style={sideStyles.name}>Rangga</Text>
            <Text style={sideStyles.email}>rangga@gmail.com</Text>
          </View>
        </View>

        <View style={sideStyles.menu}>
          {menuItems.map((item) => {
            const isOpen = openSubmenus.includes(item.label);

            return (
              <View key={item.label}>
                <TouchableOpacity
                  style={sideStyles.menuItem}
                  onPress={() =>
                    item.submenu ? toggleSubmenu(item.label) : setActiveMenu(item.label)
                  }>
                  {item.icon}
                  <Text
                    style={[
                      sideStyles.menuText,
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
                  <View style={sideStyles.submenu}>
                    {item.submenu.map((sub) => (
                      <SidebarItem
                        key={sub.label}
                        label={sub.label}
                        screen={sub.screen}
                        isSub
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        navigation={navigation}
                      />
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

function SidebarItem({
  icon,
  label,
  screen,
  color = '#374151',
  isSub = false,
  activeMenu,
  setActiveMenu,
  navigation,
}) {
  const isActive = activeMenu === label;

  const handlePress = () => {
    setActiveMenu(label);
    if (screen) navigation.navigate(screen);
  };

  return (
    <TouchableOpacity
      style={[
        sideStyles.menuItem,
        isSub && sideStyles.submenuItem,
        isActive && sideStyles.activeItem,
      ]}
      onPress={handlePress}>
      {icon && React.cloneElement(icon, { color: isActive ? '#2563eb' : color })}
      <Text
        style={[
          sideStyles.menuText,
          {
            marginLeft: icon ? 0 : 28,
            color: isActive ? '#2563eb' : color,
            fontFamily: isActive ? 'Poppins-Bold' : 'Poppins-Regular',
          },
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const navStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 8,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
  },
  iconButton: {
    padding: 6,
  },
});

const sideStyles = StyleSheet.create({
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
    fontFamily: 'Poppins-Regular',
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
