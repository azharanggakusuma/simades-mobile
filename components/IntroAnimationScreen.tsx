// components/IntroAnimationScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, Text } from 'react-native';

// URL gambar online untuk logo
const ONLINE_LOGO_URL = 'https://placehold.co/120x120/3b82f6/FFFFFF.png?text=S&font=poppins';

const IntroAnimationScreen = ({ onAnimationFinish }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4, // Sedikit disesuaikan
          tension: 50, // Sedikit disesuaikan
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacityAnim, {
        toValue: 1,
        duration: 800,
        delay: 100, // Kurangi delay sedikit
        useNativeDriver: true,
      })
    ]).start(() => {
      if (onAnimationFinish) {
        // Durasi total animasi sekitar 1000ms (logo) + 100ms (delay) + 800ms (teks) = 1900ms
        // Tambahkan sedikit timeout jika perlu sebelum transisi
        setTimeout(onAnimationFinish, 300); // Total durasi intro sekitar 2.2 detik
      }
    });
  }, [opacityAnim, scaleAnim, textOpacityAnim, onAnimationFinish]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
        <Image source={{ uri: ONLINE_LOGO_URL }} style={styles.logo} />
      </Animated.View>
      <Animated.Text style={[styles.appName, { opacity: textOpacityAnim }]}>
        SIMADES Mobile
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  appName: {
    marginTop: 20,
    fontSize: 24,
    fontFamily: 'Poppins-Bold', // Pastikan font ini sudah dimuat di App.tsx
    color: '#1F2937', // Warna teks lebih gelap
  }
});

export default IntroAnimationScreen;