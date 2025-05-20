import React, { useRef, useEffect } from 'react';
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
          <SidebarItem icon="person-outline" label="Profil Saya" />
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
    gap: 20,
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
});
