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
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Sidebar({ onClose }) {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [formExpanded, setFormExpanded] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 200,
        easing: Easing.in(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <Pressable style={styles.backdrop} onPress={handleClose} />

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        {/* CLOSE BUTTON */}
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>

        {/* PROFILE */}
        <View style={styles.profile}>
          <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>Halo, Rangga</Text>
            <Text style={styles.email}>azharanggakusuma01@gmail.com</Text>
          </View>
        </View>

        {/* MENU */}
        <View style={styles.menu}>
          <SidebarItem icon="home-outline" label="Beranda" />

          {/* FORM DROPDOWN */}
          <TouchableOpacity style={styles.menuItem} onPress={() => setFormExpanded(!formExpanded)}>
            <Ionicons name="document-text-outline" size={22} color="#374151" />
            <Text style={styles.menuText}>Form</Text>
            <Ionicons
              name={formExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#6b7280"
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
          {formExpanded && (
            <View style={styles.subMenu}>
              <SidebarSubItem label="Form A" />
              <SidebarSubItem label="Form B" />
              <SidebarSubItem label="Form C" />
            </View>
          )}

          <SidebarItem icon="people-outline" label="Manage Users" />
          <SidebarItem icon="menu-outline" label="Manage Menu" />
          <SidebarItem icon="layers-outline" label="Manage Form" />
          <SidebarItem icon="settings-outline" label="Pengaturan" />
          <SidebarItem icon="log-out-outline" label="Keluar" color="#ef4444" />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

function SidebarItem({ icon, label, color = '#374151' }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.menuText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SidebarSubItem({ label }) {
  return (
    <TouchableOpacity style={styles.subItem}>
      <Text style={styles.subItemText}>{label}</Text>
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
    width: SCREEN_WIDTH * 0.78,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 6,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
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
    gap: 16,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subMenu: {
    marginLeft: 36,
    marginTop: 6,
    gap: 10,
  },
  subItem: {
    paddingVertical: 4,
  },
  subItemText: {
    fontSize: 15,
    color: '#4b5563',
  },
});
